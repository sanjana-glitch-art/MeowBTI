"use client";

import { useState } from "react";
import LandingHero from "@/components/landing/LandingHero";
import CatIntake from "@/components/landing/CatIntake";
import ScrollQuiz from "@/components/quiz/ScrollQuiz";
import QuizBackdrop from "@/components/quiz/QuizBackdrop";
import ResultsSection from "@/components/results/ResultsSection";
import { CatTypeId } from "@/lib/catTypes";
import Footer from "@/components/landing/Footer";
import { VerdictAnswer } from "@/lib/gemini";

export default function Home() {
  const [showIntake, setShowIntake] = useState(false);
  const [catName, setCatName] = useState<string | null>(null);
  const [catImage, setCatImage] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<{
    scores: Partial<Record<CatTypeId, number>>;
    answers: VerdictAnswer[];
    freeText: string;
  } | null>(null);

  return (
    <>
      <LandingHero onStart={() => setShowIntake(true)} />

      {showIntake && !catName && (
        <CatIntake
          onContinue={(name, image) => {
            setCatName(name);
            setCatImage(image);
          }}
        />
      )}

      {catName && !quizData && (
        <QuizBackdrop>
          <ScrollQuiz
            catImageUrl={catImage}
            onComplete={(scores, answers, freeText) =>
              setQuizData({ scores, answers, freeText })
            }
          />
        </QuizBackdrop>
      )}

      {quizData && (
        <ResultsSection
          answers={quizData.answers}
          freeText={quizData.freeText}
          localScores={quizData.scores}
          catName={catName ?? undefined}
          catImage={catImage ?? undefined}
        />
      )}
      <Footer />
    </>
  );
}