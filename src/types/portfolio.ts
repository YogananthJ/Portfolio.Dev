export type ProjectCategory = 
  | 'all'
  | 'academic'
  | 'personal'
  | 'hackathon'
  | 'genai-agent'
  | 'computer-vision'
  | 'machine-learning'
  | 'full-stack';

export type ProjectKind = 'academic' | 'personal' | 'hackathon';

export interface ProjectSimulatorConfig {
  hasSimulator: boolean;
  type?: 'pdf-rag' | 'resume-parser' | 'cognitive-ai' | 'careerpilot-ai' | 'wildfire';
  title?: string;
  description?: string;
  isIllustrative?: boolean;
  externalLiveUrl?: string;
  externalLabel?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  projectKind: ProjectKind;
  tags: string[];
  metrics: { label: string; value: string; context?: string }[];
  githubUrl: string;
  demoUrl?: string;
  year: string;
  highlights: string[];
  architectureOverview: string;
  simulatorConfig: ProjectSimulatorConfig;
  gradientTheme: string;
  accentColor: string;
  methodologyNote?: string;
}

export interface SkillItem {
  name: string;
  level: 'Core' | 'Proficient' | 'Exploring';
  usedIn: string[];
  highlight?: boolean;
}

export interface SkillCategoryItem {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  skillsLearned: string[];
  description: string;
  badgeCode: string;
}

export interface MilestoneItem {
  period: string;
  type: 'academic' | 'personal' | 'hackathon' | 'learning' | 'certification';
  typeLabel: string;
  title: string;
  subtitle: string;
  summary: string;
  bullets: string[];
  technologies: string[];
  proofUrl?: string;
  proofLabel?: string;
}

// Keep backward compatibility
export type ExperienceItem = MilestoneItem;
