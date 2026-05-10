export type PhysicsTopic =
  | "Black Holes"
  | "Time Dilation"
  | "Quantum Mechanics"
  | "Space Exploration"
  | "Relativity";

export type PhysicsChapter = {
  id: string;
  topic: PhysicsTopic;
  subtitle: string;
  episode: string;
  runtime: string;
  description: string;
  accent: string;
  depth: number;
  tempo: number;
};
