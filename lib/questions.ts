import { CatTypeId } from "./catTypes";

export interface QuizOption {
  id: string;
  text: string;
  weights: Partial<Record<CatTypeId, number>>;
}

export interface QuizQuestion {
  id: string;
  stage: "surface" | "food" | "nap" | "chaos" | "existential" | "threat" | "handling";
  thought: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    stage: "surface",
    thought: "It's 3 AM.\nThe hallway calls.",
    options: [
      { id: "a", text: "I answer the call. Loudly.", weights: { chaos_agent: 2 } },
      { id: "b", text: "I stay. I am comfortable.", weights: { loaf: 2 } },
      { id: "c", text: "I go check on my human first.", weights: { diplomat: 2 } },
      { id: "d", text: "I watch the hallway from the shadows.", weights: { shadow: 2 } },
    ],
  },
  {
    id: "q2",
    stage: "food",
    thought: "The bowl is not empty.\nBut it could be fuller.",
    options: [
      { id: "a", text: "I stare at my human until they understand.", weights: { diplomat: 2 } },
      { id: "b", text: "I knock something off the counter as a reminder.", weights: { chaos_agent: 2 } },
      { id: "c", text: "I accept my fate and nap instead.", weights: { loaf: 2 } },
      { id: "d", text: "I disappear until dinner magically improves.", weights: { shadow: 2 } },
    ],
  },
  {
    id: "q3",
    stage: "nap",
    thought: "A sunbeam has appeared.\nThis changes everything.",
    options: [
      { id: "a", text: "I claim it immediately. Forever.", weights: { loaf: 2 } },
      { id: "b", text: "I stare into it like it holds answers.", weights: { void_starer: 2 } },
      { id: "c", text: "I invite my human to share it.", weights: { diplomat: 2 } },
      { id: "d", text: "I use it as cover to plan my next move.", weights: { strategist: 2 } },
    ],
  },
  {
    id: "q4",
    stage: "chaos",
    thought: "A bird has landed on the windowsill.\nThis is now the only thing that matters.",
    options: [
      { id: "a", text: "I chatter. Loudly. At the glass.", weights: { chaos_agent: 2 } },
      { id: "b", text: "I calculate an approach that will never work.", weights: { strategist: 2 } },
      { id: "c", text: "I watch silently. It doesn't know I'm here.", weights: { shadow: 2 } },
      { id: "d", text: "I lose interest within four seconds.", weights: { loaf: 2 } },
    ],
  },
  {
    id: "q5",
    stage: "existential",
    thought: "A human is holding a small rectangle.\nIt is more interesting to them than me.",
    options: [
      { id: "a", text: "I sit directly on top of it.", weights: { chaos_agent: 2 } },
      { id: "b", text: "I stare at them until they feel it.", weights: { void_starer: 2 } },
      { id: "c", text: "I leave. Their loss.", weights: { shadow: 2 } },
      { id: "d", text: "I begin formulating a longer-term plan for their attention.", weights: { strategist: 2 } },
    ],
  },
  {
    id: "q6",
    stage: "threat",
    thought: "The doorbell rings.\nA stranger stands on the other side.",
    options: [
      { id: "a", text: "I vanish. No one has seen me in years.", weights: { shadow: 2 } },
      { id: "b", text: "I station myself where I can see everything.", weights: { strategist: 2 } },
      { id: "c", text: "I greet them. They should feel lucky.", weights: { diplomat: 2 } },
      { id: "d", text: "I knock something over to announce my displeasure.", weights: { chaos_agent: 2 } },
    ],
  },
  {
    id: "q7",
    stage: "handling",
    thought: "I am being picked up.\nI did not consent to this.",
    options: [
      { id: "a", text: "I go limp. Resistance is exhausting.", weights: { loaf: 2 } },
      { id: "b", text: "I make direct, unblinking eye contact throughout.", weights: { void_starer: 2 } },
      { id: "c", text: "I tolerate it, but I am taking notes.", weights: { strategist: 2 } },
      { id: "d", text: "I announce my displeasure to the entire house.", weights: { chaos_agent: 2 } },
    ],
  },
  {
    id: "q8",
    stage: "existential",
    thought: "The vet's waiting room.\nEveryone can smell my fear.",
    options: [
      { id: "a", text: "I make myself as small and invisible as possible.", weights: { shadow: 2 } },
      { id: "b", text: "I supervise the entire room from my carrier.", weights: { strategist: 2 } },
      { id: "c", text: "I look to my human for reassurance.", weights: { diplomat: 2 } },
      { id: "d", text: "I stare at a fixed point on the wall and leave this dimension entirely.", weights: { void_starer: 2 } },
    ],
  },
];