"use client";

import { useEffect, useRef, useState } from "react";

const MOSAIC_COLORS = ["#809bce", "#95b8d1", "#b8e0d2", "#eac4d5"];
const PIXEL_COUNT = 220;
const DRIFT_VARIANTS = ["drift-a", "drift-b", "drift-c", "drift-d", "drift-e", "drift-f"];
const MIN_OPACITY_FLOOR = 0.12; 

interface PixelSpec {
  top: number;
  left: number;
  size: number;
  color: string;
  threshold: number;
  baseOpacity: number;
  driftVariant: string;
  duration: number;
  delay: number;
}

export default function QuizBackdrop({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pixelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [specs, setSpecs] = useState<PixelSpec[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const generated = Array.from({ length: PIXEL_COUNT }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 14 + Math.random() * 30,
      color: MOSAIC_COLORS[Math.floor(Math.random() * MOSAIC_COLORS.length)],
      threshold: Math.random(),
      baseOpacity: 0.35 + Math.random() * 0.25,
      driftVariant: DRIFT_VARIANTS[Math.floor(Math.random() * DRIFT_VARIANTS.length)],
      duration: 7 + Math.random() * 10,
      delay: Math.random() * 8,
    }));
    setSpecs(generated);
  }, []);

  useEffect(() => {
    function updatePixels() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const scrolledIntoView = -rect.top;
      const progress =
        totalScrollable > 0
          ? Math.min(1, Math.max(0, scrolledIntoView / totalScrollable))
          : 0;

      pixelRefs.current.forEach((el, i) => {
        if (!el) return;
        const spec = specs[i];
        if (!spec) return;
        const target = progress > spec.threshold ? MIN_OPACITY_FLOOR : spec.baseOpacity;
        el.style.opacity = String(target);
      });

      rafRef.current = null;
    }

    function onScroll() {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updatePixels);
      }
    }

    updatePixels();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [specs]);

  return (
    <div ref={wrapperRef} className="qb-wrapper">
      <div className="qb-pixels">
        {specs.map((spec, i) => (
          <div
            key={i}
            ref={(el) => {
              pixelRefs.current[i] = el;
            }}
            className={`qb-pixel ${spec.driftVariant}`}
            style={{
              top: `${spec.top}%`,
              left: `${spec.left}%`,
              width: `${spec.size}px`,
              height: `${spec.size}px`,
              background: spec.color,
              opacity: spec.baseOpacity,
              animationDuration: `${spec.duration}s`,
              animationDelay: `${spec.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="qb-content">{children}</div>
    </div>
  );
}