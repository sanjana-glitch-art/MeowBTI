"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { CatTypeId } from "@/lib/catTypes";
import { VerdictAnswer } from "@/lib/gemini";

interface ScrollQuizProps {
  catImageUrl: string | null;
  onComplete: (
    scores: Partial<Record<CatTypeId, number>>,
    answers: VerdictAnswer[],
    freeText: string
  ) => void;
}

export default function ScrollQuiz({ catImageUrl, onComplete }: ScrollQuizProps) {
  const [scores, setScores] = useState<Partial<Record<CatTypeId, number>>>({});
  const [selectedByQuestion, setSelectedByQuestion] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<VerdictAnswer[]>([]);
  const [showFreeText, setShowFreeText] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [fadingOutId, setFadingOutId] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState<{ qid: string; optId: string } | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set([QUESTIONS[0]?.id]));
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const totalSteps = QUESTIONS.length + 1;
  const answeredCount = Object.keys(selectedByQuestion).length + (submitting ? 1 : 0);
  const progress = answeredCount / totalSteps;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-qid");
            if (id) {
              setVisibleIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showFreeText]);

  useEffect(() => {
    if (showFreeText) {
      const el = document.getElementById("quiz-freetext");
      if (el) el.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [showFreeText]);

  function handleAnswer(questionIndex: number, optionId: string) {
    const question = QUESTIONS[questionIndex];
    if (selectedByQuestion[question.id]) return;

    const option = question.options.find((o) => o.id === optionId);
    if (!option) return;

    setJustSelected({ qid: question.id, optId: optionId });
    setSelectedByQuestion((prev) => ({ ...prev, [question.id]: optionId }));
    setAnswers((prev) => [...prev, { questionId: question.id, optionText: option.text }]);

    const nextScores = { ...scores };
    for (const [typeId, weight] of Object.entries(option.weights)) {
      const key = typeId as CatTypeId;
      nextScores[key] = (nextScores[key] || 0) + (weight || 0);
    }
    setScores(nextScores);

    setTimeout(() => {
      setFadingOutId(question.id);
    }, 250);

    setTimeout(() => {
      const isLast = questionIndex === QUESTIONS.length - 1;
      if (isLast) {
        setShowFreeText(true); 
      } else {
        const nextEl = document.getElementById(`quiz-q-${questionIndex + 1}`);
        if (nextEl) nextEl.scrollIntoView({ behavior: "auto", block: "center" });
      }
      setFadingOutId(null);
      setJustSelected(null);
    }, 750);
  }

  function handleSubmitFreeText() {
    if (freeText.trim().length < 3 || submitting) return;
    setSubmitting(true);
    onComplete(scores, answers, freeText.trim());
    setTimeout(() => {
      const el = document.getElementById("results-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <>
      <div className="sq-cat-track">
        <div className="sq-cat-track-border">
          <div
            className="sq-cat-track-fill"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
        <div
          className="sq-cat-track-icon"
          style={{ left: `${Math.min(100, progress * 100)}%` }}
        >
          {catImageUrl ? (
            <img src={catImageUrl} alt="" className="sq-cat-track-photo" />
          ) : (
            <div className="sq-cat-track-photo sq-cat-track-photo-fallback" />
          )}
        </div>
      </div>

      {QUESTIONS.map((question, qIndex) => {
        const isFadingOut = fadingOutId === question.id;
        const isVisible = visibleIds.has(question.id);

        return (
          <section
            key={question.id}
            id={`quiz-q-${qIndex}`}
            data-qid={question.id}
            ref={(el) => {
              sectionRefs.current[question.id] = el;
            }}
            className={`sq-section ${isFadingOut ? "sq-fade-out" : ""} ${
              isVisible ? "sq-fade-in" : "sq-pre-fade"
            }`}
          >
            <div className="sq-question">{question.thought}</div>

            <div className="sq-options">
              {question.options.map((opt) => {
                const isThisSelected =
                  justSelected?.qid === question.id && justSelected?.optId === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`sq-option ${
                      selectedByQuestion[question.id] === opt.id ? "selected" : ""
                    } ${isThisSelected ? "sq-option-pop" : ""}`}
                    disabled={!!selectedByQuestion[question.id]}
                    onClick={() => handleAnswer(qIndex, opt.id)}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {showFreeText && (
        <section id="quiz-freetext" className="sq-section sq-fade-in">
          <div className="sq-question">
            One last thing.
            <br />
            Describe your cat in your own words.
          </div>
          <textarea
            className="sq-freetext"
            placeholder="e.g. He sits in the sink, ignores his toys, and screams at 5am for no reason..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={400}
            disabled={submitting}
          />
          <button
            className="mp-start-btn"
            style={{ marginTop: "20px" }}
            onClick={handleSubmitFreeText}
            disabled={freeText.trim().length < 3 || submitting}
          >
            {submitting ? "SUBMITTING..." : "REVEAL VERDICT"}
          </button>
        </section>
      )}
    </>
  );
}