# Architecture Overview

## High-Level Flow

MeowBTI is a single-page Next.js App Router application. All state for the user's session (name, photo, quiz answers, scores, free text, result) lives in React state at the top level (`app/page.tsx`) and is passed down as props - there is no client-side routing between steps, only conditional rendering as the user progresses. Progression is scroll-driven rather than click-driven navigation, to match the "flowing case file" visual concept.

```
┌─────────────────┐
│   LandingHero    │  User clicks START
└────────┬─────────┘
         ▼
┌─────────────────┐
│    CatIntake     │  Collects name + optional photo
│                   │  Photo is resized/compressed client-side
│                   │  (canvas-based, capped at 600px, JPEG q=0.8)
└────────┬─────────┘
         ▼
┌─────────────────┐
│  QuizBackdrop     │  Animated scroll-reactive pixel background wrapper
│  └─ ScrollQuiz    │  8 questions, IntersectionObserver-driven fade-in,
│                   │  scroll-snap between sections, accumulates per-type
│                   │  scores, then collects a free-text description
└────────┬─────────┘
         ▼
┌─────────────────┐
│ ResultsSection    │  POSTs { answers, freeText, localScores } to
│                   │  /api/verdict, shows loading state, then either
│                   │  the result card or a graceful error message
└────────┬─────────┘
         ▼
┌─────────────────┐
│    CatCard        │  Renders the verdict as a game-card-styled UI.
│                   │  html2canvas captures this DOM node for
│                   │  download (PNG) or native share (Web Share API,
│                   │  with clipboard-copy and download fallbacks)
└──────────────────┘
```

## Server-Side: `/api/verdict`

This is the only server-side logic in the app (aside from Next.js's default static/SSR handling). It is intentionally kept simple and defensive:

1. **Rate limiting** - a per-IP in-memory counter (8 requests / 60 seconds) rejects excessive requests with a `429`.
2. **Input validation** - rejects requests with missing or too-short (`<3` chars) or too-long (`>1000` chars) free-text descriptions with a `400`.
3. **Fallback-first design** - if no `GEMINI_API_KEY` is configured, or if the Gemini call fails, times out, returns a non-OK status, or returns unparseable/invalid JSON, the route falls back to `fallbackFromScores()` - a deterministic verdict derived purely from the quiz's local scoring. **The user-facing flow never hard-fails because of the AI call** - worst case, they get a slightly more generic (but still complete and on-brand) verdict.
4. **Timeout protection** - the Gemini fetch is wrapped in an `AbortController` with an 8-second timeout, so a slow or hanging upstream request can't stall the serverless function indefinitely.

### Prompt Construction (`lib/gemini.ts`)

The prompt sent to Gemini combines:
- The owner's answer to each quiz question (for behavioral context)
- The raw per-type scores from the quiz (used as the *primary* signal)
- The owner's free-text description (used as supporting or tie-breaking evidence)
- A short description of each of the six candidate personality types

The model is explicitly instructed to weigh quiz scoring as primary and free text as a tie-breaker, and to respond in a strict JSON shape (`{"type": ..., "verdict": ...}`) with no markdown or preamble, which is then validated against the known list of valid type IDs before being trusted (`parseVerdictResponse`). If the returned `type` doesn't match one of the six known IDs, the response is treated as invalid and the fallback path is used instead - the app never trusts an arbitrary string from the model as a type without validating it against a closed list.

## Client-Side State Design

State is intentionally kept flat and centralized in `page.tsx` rather than using a global store (Redux/Zustand/Context), since the entire app is a single linear flow with only four state slices: `showIntake`, `catName`, `catImage`, `quizData`. This was a deliberate scope decision - a global store would be over-engineering for an app with no branching navigation and no persistence.

## Visual System

- **Seeded PRNG (`lib/mosaic.ts`)** - the pixel-mosaic backgrounds on the hero and intake sections use a mulberry32 seeded random number generator, so the "random" pixel pattern is actually deterministic per seed. This means the background looks the same on every load rather than shifting on every refresh, which was a deliberate visual choice.
- **Scroll-reactive opacity (`QuizBackdrop.tsx`)** - background pixels fade based on scroll progress through the quiz container, computed via `getBoundingClientRect()` and throttled with `requestAnimationFrame` to avoid firing on every scroll event.
- **IntersectionObserver-driven question reveals (`ScrollQuiz.tsx`)** - each question section fades in only once it's scrolled into view, rather than all being visible/animated at once.

## Result Card Capture

`html2canvas` is used to rasterize the live DOM node (the `CatCard` component) into a canvas, which is then either:
- Converted to a data URL and downloaded as a PNG, or
- Converted to a `Blob` and passed to the Web Share API (`navigator.share`) if supported (mobile-first), with a clipboard-copy fallback, and a final direct-download fallback if neither is available.

This was chosen over generating the card image server-side (e.g. via a headless browser or image library) to avoid adding server-side rendering complexity and cost for a hackathon scope, at the cost of being dependent on the client's rendering of the DOM node being pixel-accurate at capture time.