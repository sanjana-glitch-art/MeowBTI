"use client";

import { useEffect, useRef, useState } from "react";
import { generateMosaicGrid, intakeDensity, MosaicCell } from "@/lib/mosaic";

const MOSAIC_COLUMNS = 100;
const MOSAIC_ROWS = 10;
const MAX_DIMENSION = 600; 
const JPEG_QUALITY = 0.8;

interface CatIntakeProps {
  onContinue: (name: string, imageDataUrl: string | null) => void;
}

export default function CatIntake({ onContinue }: CatIntakeProps) {
  const [name, setName] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mosaicCells, setMosaicCells] = useState<MosaicCell[]>([]);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMosaicCells(generateMosaicGrid(MOSAIC_ROWS, MOSAIC_COLUMNS, intakeDensity, 100));
  }, []);

  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Couldn't read that image."));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Couldn't process that image."));
        img.onload = () => {
          let { width, height } = img;

          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Image processing isn't supported here."));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Photo is too large — please pick one under 10MB.");
      return;
    }

    setError("");
    setProcessingImage(true);
    try {
      const resized = await resizeImage(file);
      setImageDataUrl(resized);
    } catch {
      setError("Couldn't process that image — try another.");
    } finally {
      setProcessingImage(false);
    }
  }

  function handleContinue() {
    if (name.trim().length < 1) {
      setError("Your cat needs a name.");
      return;
    }
    setError("");
    onContinue(name.trim(), imageDataUrl);
    setTimeout(() => {
      const el = document.getElementById("quiz-q-0");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <section id="cat-intake" className="ci-hero">
      <div
        className="ci-sparse"
        style={{ gridTemplateRows: `repeat(${MOSAIC_ROWS}, 1fr)` }}
      >
        {mosaicCells.map((cell, i) => (
          <div
            key={i}
            className="ci-pixel"
            style={{ background: cell.color ?? "transparent" }}
          />
        ))}
      </div>

      <div className="ci-content">
        <h2 className="ci-title pixel-font">Tell us about your cat</h2>
        <br></br>
        <br></br>
        <br></br>

        <input
          className="ci-input"
          type="text"
          placeholder="e.g. Mochi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />

        <label className="ci-upload-label" htmlFor="cat-photo">
          {processingImage ? (
            <span className="ci-upload-placeholder">Processing...</span>
          ) : imageDataUrl ? (
            <img src={imageDataUrl} alt="Your cat's photo" className="ci-preview" />
          ) : (
            <span className="ci-upload-placeholder">+ Upload a photo</span>
          )}
        </label>
        <input
          id="cat-photo"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="ci-file-input"
        />

        {error && <p className="ci-error">{error}</p>}

        <button className="mp-start-btn" onClick={handleContinue} disabled={processingImage}>
          CONTINUE
        </button>
      </div>
    </section>
  );
}