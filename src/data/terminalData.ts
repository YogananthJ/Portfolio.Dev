import { TerminalTheme, TerminalThemeConfig } from '../types/terminal';

export const TERMINAL_THEMES: Record<TerminalTheme, TerminalThemeConfig> = {
  default: {
    name: 'default',
    label: 'Dark Ink & Crimson',
    bg: 'bg-[#121212]',
    headerBg: 'bg-[#1C1C1E]',
    text: 'text-[#F5F2EB]',
    accent: 'text-[#E11D48]',
    secondary: 'text-emerald-400',
    prompt: '#E11D48',
    border: 'border-[#121212] shadow-[8px_8px_0px_0px_#E11D48]',
  },
  matrix: {
    name: 'matrix',
    label: 'Matrix Digital Rain',
    bg: 'bg-[#050D08]',
    headerBg: 'bg-[#0B1A10]',
    text: 'text-emerald-400',
    accent: 'text-emerald-300 font-bold',
    secondary: 'text-emerald-500',
    prompt: '#10B981',
    border: 'border-emerald-600 shadow-[8px_8px_0px_0px_#059669]',
  },
  cyberpunk: {
    name: 'cyberpunk',
    label: 'Cyberpunk 2077',
    bg: 'bg-[#0D0B18]',
    headerBg: 'bg-[#18152B]',
    text: 'text-yellow-300',
    accent: 'text-cyan-400',
    secondary: 'text-fuchsia-400',
    prompt: '#06B6D4',
    border: 'border-cyan-400 shadow-[8px_8px_0px_0px_#F43F5E]',
  },
  dracula: {
    name: 'dracula',
    label: 'Dracula Midnight',
    bg: 'bg-[#1E1F29]',
    headerBg: 'bg-[#282A36]',
    text: 'text-[#F8F8F2]',
    accent: 'text-[#FF79C6]',
    secondary: 'text-[#8BE9FD]',
    prompt: '#BD93F9',
    border: 'border-[#6272A4] shadow-[8px_8px_0px_0px_#BD93F9]',
  },
  amber: {
    name: 'amber',
    label: 'Retro CRT Phosphor',
    bg: 'bg-[#150F00]',
    headerBg: 'bg-[#261B00]',
    text: 'text-amber-400',
    accent: 'text-amber-300 font-bold',
    secondary: 'text-amber-500',
    prompt: '#F59E0B',
    border: 'border-amber-600 shadow-[8px_8px_0px_0px_#D97706]',
  },
  paper: {
    name: 'paper',
    label: 'Archival Monochrome',
    bg: 'bg-[#F5F2EB]',
    headerBg: 'bg-[#EBE6DC]',
    text: 'text-[#121212]',
    accent: 'text-[#E11D48]',
    secondary: 'text-[#121212]/80',
    prompt: '#E11D48',
    border: 'border-[#121212] shadow-[8px_8px_0px_0px_#121212]',
  },
};

export const ASCII_BANNER = `
██╗   ██╗ ██████╗  ██████╗  █████╗ ███╗   ██╗ █████╗ ███╗   ██╗████████╗██╗  ██╗
╚██╗ ██╔╝██╔═══██╗██╔════╝ ██╔══██╗████╗  ██║██╔══██╗████╗  ██║╚══██╔══╝██║  ██║
 ╚████╔╝ ██║   ██║██║  ███╗███████║██╔██╗ ██║███████║██╔██╗ ██║   ██║   ███████║
  ╚██╔╝  ██║   ██║██║   ██║██╔══██║██║╚██╗██║██╔══██║██║╚██╗██║   ██║   ██╔══██║
   ██║   ╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║██║  ██║██║ ╚████║   ██║   ██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝
`;

export const NEOFETCH_LOGO = `
       .---.
      /     \\      YOGANANTH J
     ( () () )     ----------------------------
      \\  _  /      OS: Arch Linux x86_64 / WebOS 2026
       /   \\       Host: Google AI Studio Production
      /|   |\\      Kernel: React 19.0.1 + TypeScript 5.8
     / |   | \\     Uptime: Active & Ready for 2026
    (  |===|  )    Shell: zsh / bash 5.2 (custom CLI)
     \\ |   | /     Resolution: 1440x900 Responsive
      \\|   |/      Theme: Neo-Brutalist Archival
       '---'       Terminal: Yogananth-Interactive-Shell
                   CPU: Neural Tensor Engine (PyTorch/XGBoost)
                   GPU: WebGL 2.0 / Canvas Accelerated
                   Memory: 16GB Virtual Heap Allocated
`;

export const MANIFESTO_PRINCIPLES = [
  {
    title: '01. Function & Grounded Execution Over Vanity',
    body: 'A software model is only as valuable as its reliability in production. Working code, verifiable outputs, and tested edge cases always supersede ungrounded prototypes.',
  },
  {
    title: '02. White-Box Explainability Over Black-Box Opacity',
    body: 'Whether using SHAP attribution in financial underwriting or attention attribution in vision models, engineers must explain WHY algorithms make decisions.',
  },
  {
    title: '03. Zero-Slop Architectural Craft',
    body: 'No lazy defaults, no placeholder stubs, and no unnecessary bloat. Interfaces should reflect intentional human discipline, typography math, and domain-native design.',
  },
  {
    title: '04. End-to-End Ownership',
    body: 'True full-stack engineering bridges the mathematical algorithm (Python/PyTorch/Scikit) with the user surface (React/TypeScript/Tailwind) and deployment pipelines.',
  },
];

export const CURRENTLY_BUILDING = [
  'Fine-tuning reasoning pipelines with local Llama 3.1 & QLoRA adapters',
  'Exploring WebGPU compute shaders for browser-based vector inference',
  'Constructing multi-modal computer vision benchmarks for real-time edge processing',
  'Reading research papers on Reciprocal Rank Fusion & Sparse-Dense Hybrid RAG',
];

export const FUN_FACTS = [
  'Wrote his first Python automation script before taking a single formal computer science lecture.',
  'Can identify model overfitting purely from an ASCII terminal training loss log curve.',
  'Prefers Vim keybindings, JetBrains Mono font, and zero-distraction terminal buffers.',
  'Trained the wildfire hotspot classifier on real NASA & Landsat-9 multi-spectral satellite imagery.',
  'Built custom mathematical simulators for every single one of his public portfolio repositories.',
  'Types at 95+ WPM when debugging PyTorch tensors at 2 AM.',
];

export const DEV_QUOTES = [
  { quote: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { quote: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { quote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { quote: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { quote: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
  { quote: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
];

export const PROGRAMMING_JOKES = [
  'Why do machine learning algorithms love trees? Because they always branch out without overthinking!',
  'Why do Java developers wear glasses? Because they do not C#!',
  'There are 10 types of people in the world: those who understand binary, and those who do not.',
  'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
  'Why was the JavaScript developer sad? Because they did not know how to `null` their feelings.',
  'How many programmers does it take to change a light bulb? None, that is a hardware problem.',
];

export const FORTUNES = [
  'Your next gradient descent step will reach a global minimum without vanishing gradients.',
  'A clean pull request with 100% test coverage will be merged on your first attempt today.',
  'You will discover an O(1) optimization in a place everyone assumed was O(n).',
  'The bug is not in your model, it was in the data normalization all along. And you will fix it.',
  'An opportunity to build transformative software is heading your way this season.',
];

export const SERVICES_LIST = [
  {
    name: 'Autonomous AI & Machine Learning Systems',
    desc: 'Training custom predictive models, XGBoost risk underwriting engines, and deep neural classifiers.',
  },
  {
    name: 'Retrieval-Augmented Generation (RAG) & LLM Tooling',
    desc: 'Building grounded document intelligence assistants with vector databases, semantic re-ranking, and zero hallucination.',
  },
  {
    name: 'Full-Stack Web Application Architecture',
    desc: 'Production-ready React 19, TypeScript, Node.js, and Flask applications with auth, webhooks, and responsive design.',
  },
  {
    name: 'Computer Vision & Multi-Spectral Pipelines',
    desc: 'Image segmentation, thermal hotspot detection, and meal calorie estimation using OpenCV and CNN architectures.',
  },
  {
    name: 'Data Analytics & Workflow Automation',
    desc: 'Automating enterprise logistics, supply chain safety stock models, and custom Google Apps Script flows.',
  },
];

export const CHANGELOG_ENTRIES = [
  {
    version: 'v2.6.2 (Current)',
    date: 'October 2026',
    changes: [
      'Engineered interactive Developer Command Center terminal with 40+ commands',
      'Added Neofetch card, Matrix digital rain simulation, and architecture diagrams',
      'Integrated live command autocomplete (Tab) and history navigation (Arrow keys)',
      'Integrated personalized anime developer avatar across hero and favicon',
    ],
  },
  {
    version: 'v2.6.0',
    date: 'October 2026',
    changes: [
      'Added Dual-Pane Split-Screen developer workbench with customizable ratios',
      'Built interactive live simulators for all 7 deployed machine learning projects',
      'Implemented GSAP 3.0 kinetic typography and 3D card tilt physics',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'Mid 2025',
    changes: [
      'Initial release of full-stack portfolio with React, TypeScript, and Tailwind CSS',
      'Published Loan Approval Prediction and Wildfire Detection research prototypes',
    ],
  },
];

export const ALL_COMMAND_NAMES = [
  'help', 'whoami', 'manifesto', 'timeline', 'currently', 'funfact',
  'projects', 'project', 'featured', 'architecture', 'casestudy',
  'github', 'live', 'lab', 'changelog',
  'skills', 'stack', 'ml', 'webdev', 'toolbox', 'learning', 'roadmap',
  'matrix', 'quote', 'joke', 'motd', 'fortune', 'theme', 'sudo hire', 'secret', 'hack', 'ping', 'status',
  'contact', 'hire', 'resume', 'linkedin', 'collaborate', 'availability', 'services',
  'history', 'date', 'uptime', 'clear', 'banner', 'neofetch', 'ls', 'cat', 'open', 'exit'
];
