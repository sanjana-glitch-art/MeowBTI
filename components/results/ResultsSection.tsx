"use client";

import { useEffect, useRef, useState } from "react";
import CatCard from "./CatCard";
import { CAT_TYPES, CatTypeId } from "@/lib/catTypes";
import { VerdictAnswer } from "@/lib/gemini";

const LOADING_MESSAGES = [
  "Sorting memories...",
  "Consulting orange cat database...",
  "Searching under couch...",
  "Finding missing brain cell...",
];

interface ResultsSectionProps {
  answers: VerdictAnswer[];
  freeText: string;
  localScores: Partial<Record<CatTypeId, number>>;
  catName?: string;
  catImage?: string;
}

export default function ResultsSection({
  answers,
  freeText,
  localScores,
  catName,
  catImage,
}: ResultsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [overlayActive, setOverlayActive] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<{ type: CatTypeId; verdict: string } | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setOverlayActive(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    async function fetchVerdict() {
      try {
        const res = await fetch("/api/verdict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, freeText, localScores }),
        });
        const data = await res.json();
        if (!res.ok || !data.type) {
          setFetchError(true);
        } else {
          setResult({ type: data.type, verdict: data.verdict });
        }
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVerdict();
  }, [answers, freeText, localScores]);

  useEffect(() => {
    if (!loading && result) {
      const t1 = setTimeout(() => {
        setRevealed(true);
      }, 400);
      return () => {
        clearTimeout(t1);
      };
    }
  }, [loading, result]);

  async function captureCard() {
    if (!certRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(certRef.current, {
      backgroundColor: "#2e2a45",
      scale: 2,
    });
  }

  async function handleDownload() {
    const canvas = await captureCard();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meowbti-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function handleShare() {
    const canvas = await captureCard();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "meowbti-card.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "My MeowBTI Result",
            text: catType
              ? `My cat got "${catType.name}"! Find out your cat's type:`
              : "Find out your cat's personality type:",
          });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
          // fall through to clipboard fallback below
        }
      }

      // Fallback: copy image to clipboard (works in most modern desktop browsers)
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setShareStatus("Copied to clipboard!");
        setTimeout(() => setShareStatus(null), 2500);
      } catch {
        // Final fallback: just download instead
        const link = document.createElement("a");
        link.download = "meowbti-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        setShareStatus("Sharing isn't supported here — downloaded instead.");
        setTimeout(() => setShareStatus(null), 2500);
      }
    }, "image/png");
  }

  const catType = result ? CAT_TYPES[result.type] : null;

  return (
    <section
      id="results-section"
      className={`results-overlay ${overlayActive ? "results-overlay-active" : ""}`}
    >

      {loading && (
        <div className="pixel-font results-loading-text">
          {LOADING_MESSAGES[loadingMsgIndex]}
        </div>
      )}

      {!loading && fetchError && (
        <div className="pixel-font results-loading-text">
          Couldn&apos;t reach the verdict machine. Please try refreshing.
        </div>
      )}

      {!loading && catType && (
        <div
          ref={certRef}
          className={`results-card-pop ${revealed ? "results-card-pop-in" : ""}`}
        >
          <CatCard
            catType={catType}
            verdict={result?.verdict ?? ""}
            catName={catName}
            catImage={catImage}
          />
        </div>
      )}

      {revealed && (
        <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
          <button className="mp-start-btn" onClick={handleDownload}>
            DOWNLOAD CARD
          </button>
          <button className="mp-start-btn" onClick={handleShare}>
            SHARE
          </button>
        </div>
      )}

      {shareStatus && (
        <div className="pixel-font results-loading-text" style={{ marginTop: "12px" }}>
          {shareStatus}
        </div>
      )}
    </section>
  );
}