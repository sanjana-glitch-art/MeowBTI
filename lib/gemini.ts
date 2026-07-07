import { CAT_TYPE_LIST, CatTypeId } from "./catTypes";
import { QUESTIONS } from "./questions";

export interface VerdictAnswer {
  questionId: string;
  optionText: string;
}

export interface VerdictRequestBody {
  answers: VerdictAnswer[];
  freeText: string;
  localScores: Partial<Record<CatTypeId, number>>;
}

export interface VerdictResult {
  type: CatTypeId;
  verdict: string;
}

function topScoringTypes(scores: Partial<Record<CatTypeId, number>>): CatTypeId[] {
  let best = -1;
  for (const t of CAT_TYPE_LIST) {
    const s = scores[t.id] ?? 0;
    if (s > best) best = s;
  }
  return CAT_TYPE_LIST.filter((t) => (scores[t.id] ?? 0) === best).map((t) => t.id);
}

export function buildPrompt(body: VerdictRequestBody): string {
  const answerLines = body.answers
    .map((a) => {
      const q = QUESTIONS.find((q) => q.id === a.questionId);
      return `- ${q?.thought.replace(/\n/g, " ") ?? a.questionId}: "${a.optionText}"`;
    })
    .join("\n");

  const typeLines = CAT_TYPE_LIST.map(
    (t) => `- ${t.id}: "${t.name}" — ${t.description}`
  ).join("\n");

  const leaders = topScoringTypes(body.localScores);
  const leaderHint =
    leaders.length === 1
      ? `The quiz's raw scoring already leans toward "${leaders[0]}". Treat this as a strong prior — only override it if the owner's free-text description clearly points somewhere else.`
      : `The quiz's raw scoring is tied between: ${leaders.join(", ")}. Use the owner's free-text description as the deciding factor between these.`;

  return `You are a bureaucratic feline behavioral analyst at the Institute of Feline Behavioral Sciences. You must classify a cat into exactly one of six personality types based on quiz answers and an owner's free-text description.

QUIZ ANSWERS:
${answerLines}

QUIZ SCORING (raw points per type, higher = stronger signal):
${CAT_TYPE_LIST.map((t) => `- ${t.id}: ${body.localScores[t.id] ?? 0}`).join("\n")}

${leaderHint}

OWNER'S DESCRIPTION OF THE CAT:
"${body.freeText}"

AVAILABLE TYPES:
${typeLines}

Weigh the quiz scoring as the primary signal and the owner's description as supporting or tie-breaking evidence. Pick the single best-fitting type id from the list above (must match exactly, e.g. "chaos_agent").

Then write a 2-3 sentence "official verdict" in a dry, bureaucratic, deadpan-funny tone, as if issuing an official case file report on this cat. Reference something specific from the owner's description if possible.

Respond ONLY with valid JSON in this exact shape, no markdown, no backticks, no preamble:
{"type": "<type_id>", "verdict": "<2-3 sentence verdict>"}`;
}

export function parseVerdictResponse(raw: string): VerdictResult | null {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed.type === "string" &&
      typeof parsed.verdict === "string" &&
      CAT_TYPE_LIST.some((t) => t.id === parsed.type)
    ) {
      return { type: parsed.type as CatTypeId, verdict: parsed.verdict };
    }
    return null;
  } catch {
    return null;
  }
}

export function fallbackFromScores(
  scores: Partial<Record<CatTypeId, number>>
): VerdictResult {
  const leaders = topScoringTypes(scores);
  const priority: CatTypeId[] = ["strategist", "shadow", "void_starer", "diplomat", "chaos_agent", "loaf"];
  const bestType = priority.find((id) => leaders.includes(id)) ?? leaders[0] ?? "loaf";

  const type = CAT_TYPE_LIST.find((t) => t.id === bestType)!;
  return {
    type: bestType,
    verdict: `Based on quiz results alone: ${type.tagline} ${type.description}`,
  };
}