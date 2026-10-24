export type ArchitectureNodeType = 'frontend' | 'backend' | 'ai-model' | 'api' | 'storage';

export interface ArchitectureNode {
  id: string;
  label: string;
  subtitle: string;
  type: ArchitectureNodeType;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  inputs: string[];
  outputs: string[];
  description: string;
  technologies: string[];
  responsibilities: string[];
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
  dataFlowDescription: string;
}

export interface ProjectArchitecture {
  projectId: string;
  projectTitle: string;
  category: 'academic' | 'personal' | 'hackathon';
  overview: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  textExplanation: string[];
  undocumentedNotes?: string;
}
