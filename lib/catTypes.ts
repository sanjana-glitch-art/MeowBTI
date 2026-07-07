export type CatTypeId =
  | "void_starer"
  | "chaos_agent"
  | "diplomat"
  | "strategist"
  | "loaf"
  | "shadow";

export interface CatType {
  id: CatTypeId;
  caseCode: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  traits: string[];
  color: string;
}

export const CAT_TYPES: Record<CatTypeId, CatType> = {
  void_starer: {
    id: "void_starer",
    caseCode: "VS-01",
    name: "The Void Starer",
    tagline: "Sees things you cannot.",
    description:
      "Stares at empty corners for unexplained reasons. Operates on a perceptual wavelength unavailable to humans. Possibly guarding the house from something. Possibly thinking about nothing at all.",
    icon: "👁️",
    traits: ["Highly alert", "Unreadable motives", "3am specialist"],
    color: "#809bce",
  },
  chaos_agent: {
    id: "chaos_agent",
    caseCode: "CA-02",
    name: "The Chaos Agent",
    tagline: "Knocks things off tables on purpose.",
    description:
      "Operates without a discernible plan, which is itself the plan. Peak activity hours: whenever you're trying to sleep or work. Considers gravity a personal challenge.",
    icon: "🌀",
    traits: ["High energy", "Zero impulse control", "Table hazard"],
    color: "#eac4d5",
  },
  diplomat: {
    id: "diplomat",
    caseCode: "DP-03",
    name: "The Diplomat",
    tagline: "Negotiates snacks with grace.",
    description:
      "Prefers soft power over confrontation. Will sit near you, not on you, until trust is earned. Excellent at getting what it wants without ever seeming to ask.",
    icon: "🤝",
    traits: ["Socially skilled", "Patient", "Quietly persuasive"],
    color: "#b8e0d2",
  },
  strategist: {
    id: "strategist",
    caseCode: "ST-04",
    name: "The Strategist",
    tagline: "Has a plan. Won't share it.",
    description:
      "Watches, calculates, waits. Every nap is tactical positioning. Every stare is reconnaissance. You will not know the plan until it is already in motion.",
    icon: "♟️",
    traits: ["Calculating", "Patient hunter", "Long-term thinker"],
    color: "#95b8d1",
  },
  loaf: {
    id: "loaf",
    caseCode: "LF-05",
    name: "The Loaf",
    tagline: "Has assumed final form.",
    description:
      "Has optimized the body for maximum surface-area-to-effort ratio. Movement is a last resort. Currently loading. Please do not disturb the loaf.",
    icon: "🍞",
    traits: ["Low power mode", "Structurally stable", "Deeply comfortable"],
    color: "#d6eadf",
  },
  shadow: {
    id: "shadow",
    caseCode: "SH-06",
    name: "The Shadow",
    tagline: "Was never here.",
    description:
      "Appears only when convenient. Vanishes the moment guests arrive. May or may not live in this house — evidence is circumstantial, sightings are rare.",
    icon: "🌑",
    traits: ["Elusive", "Guest-averse", "Low visibility"],
    color: "#5f78ab",
  },
};

export const CAT_TYPE_LIST = Object.values(CAT_TYPES);