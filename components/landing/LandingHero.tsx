"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { generateMosaicGrid, heroDensity, MosaicCell } from "@/lib/mosaic";

const MOSAIC_COLUMNS = 80;
const MOSAIC_ROWS = 10;

interface LandingHeroProps {
  onStart: () => void;
  shareCount?: number;
}

export default function LandingHero({ onStart, shareCount = 1204 }: LandingHeroProps) {
  const [mosaicCells, setMosaicCells] = useState<MosaicCell[]>([]);

  useEffect(() => {
    setMosaicCells(generateMosaicGrid(MOSAIC_ROWS, MOSAIC_COLUMNS, heroDensity, 42));
  }, []);

  function handleStart() {
    onStart();
    const next = document.getElementById("cat-intake");
    if (next) {
      next.scrollIntoView({ behavior: "smooth" });
    }
  }

  function playMeow() {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const duration = 0.75;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(380, now);
    osc1.frequency.linearRampToValueAtTime(560, now + duration * 0.35);
    osc1.frequency.linearRampToValueAtTime(230, now + duration);

    osc2.frequency.setValueAtTime(380 * 1.005, now);
    osc2.frequency.linearRampToValueAtTime(560 * 1.005, now + duration * 0.35);
    osc2.frequency.linearRampToValueAtTime(230 * 1.005, now + duration);

    filter.type = "lowpass";
    filter.Q.value = 6;
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(2200, now + duration * 0.35);
    filter.frequency.linearRampToValueAtTime(500, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    osc1.onended = () => ctx.close();
  }

  return (
    <section className="mp-hero">
      <div
        className="mp-mosaic"
        style={{ gridTemplateRows: `repeat(${MOSAIC_ROWS}, 1fr)` }}
      >
        {mosaicCells.map((cell, i) => (
          <div
            key={i}
            className="mp-mosaic-cell"
            style={{ background: cell.color ?? "transparent" }}
          />
        ))}
      </div>

      <div className="mp-content">
        <div>
          <h1 className="mp-title">MeowBTI</h1>
          <p className="mp-tagline">
            Cats already run the internet. Let&apos;s find out which one runs your house.
          </p>
        </div>

        <div className="mp-cat-wrap">
          <Image
            src="/cat-left.png"
            alt="Click for a meow"
            width={280}
            height={280}
            className="mp-side-cat-img"
            priority
            onClick={playMeow}
          />
          <div className="mp-side-cat-shadow" />
        </div>

        <button className="mp-start-btn" onClick={handleStart}>
          START
        </button>
      </div>
    </section>
  );
}