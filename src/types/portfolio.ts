export type ProjectCategory = 
  | 'all'
  | 'machine-learning'
  | 'computer-vision'
  | 'full-stack'
  | 'data-analytics'
  | 'genai-nlp';

export interface ProjectSimulatorConfig {
  type: 'loan' | 'food' | 'event' | 'wildfire' | 'supply-chain' | 'rag' | 'cognitive';
  title: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string;
  demoUrl?: string;
  year: string;
  highlights: string[];
  architectureOverview: string;
  simulatorConfig: ProjectSimulatorConfig;
  gradientTheme: string;
  accentColor: string;
}

export interface SkillCategoryItem {
  category: string;
  description: string;
  skills: {
    name: string;
    level: string;
    icon?: string;
    usedIn: string[];
  }[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  organization: string;
  location: string;
  summary: string;
  achievements: string[];
  technologies: string[];
}
