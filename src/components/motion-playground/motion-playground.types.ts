export type MotionCategory = 
  | 'all' 
  | 'physics' 
  | 'particles' 
  | 'typography' 
  | 'generative' 
  | '3d' 
  | 'relaxation';

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
