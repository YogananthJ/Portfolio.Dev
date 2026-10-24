export type MotionCategory = 'all' | 'gsap' | 'threejs' | 'vanillajs' | 'canvas';

export interface MotionExperiment {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: MotionCategory;
  categoryLabel: string;
  technologies: string[];
  interactionHint: string;
  techniqueExplanation: string;
  keyConcepts: string[];
  sourceCode: string;
  codeLanguage: string;
}
