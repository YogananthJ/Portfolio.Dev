import { ProjectItem, SkillCategoryItem, ExperienceItem } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Yogananth J',
  role: 'AI & Full Stack Engineer',
  headline: 'Future-focused developer building web apps, machine learning models, and intelligent automation.',
  bio: "I'm a passionate engineer focused on bridging artificial intelligence and real-world software. From training predictive classifiers and vision models to engineering high-performance web applications and automated workflows, I build practical systems that deliver measurable impact.",
  email: 'mjyogananth@gmail.com',
  location: 'Tamil Nadu, India',
  availability: 'Available for Summer 2026 / Full-Time Eng Opportunities',
  github: 'https://github.com/YogananthJ',
  linkedin: 'https://www.linkedin.com/in/yogananth-j-653400307/',
  stats: [
    { label: 'Projects Shipped', value: '15+' },
    { label: 'Core Disciplines', value: 'AI · Web · Automation' },
    { label: 'Model Accuracy Achieved', value: 'Up to 96%' },
    { label: 'Primary Language', value: 'Python & TypeScript' },
  ],
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'loan-approval',
    title: 'Loan Approval Prediction',
    tagline: 'High-precision risk underwriting engine with SHAP explainability',
    description:
      'Predicts loan applicant approval status using optimized Logistic Regression and XGBoost classifiers. Incorporates automated feature engineering, outlier detection, and SHAP (SHapley Additive exPlanations) to provide transparent feature-attribution reasons for credit officers.',
    category: 'machine-learning',
    categoryLabel: 'Machine Learning',
    tags: ['Python', 'XGBoost', 'Scikit-Learn', 'SHAP', 'Flask'],
    metrics: [
      { label: 'ROC-AUC Score', value: '94.2%' },
      { label: 'Decision Latency', value: '< 25ms' },
      { label: 'Engineered Features', value: '18 Factors' },
    ],
    githubUrl: 'https://github.com/YogananthJ/loan_approval_prediction',
    year: '2025',
    highlights: [
      'Engineered Debt-to-Income and credit history weighting ratios that boosted recall by 12.4%',
      'Eliminated black-box opacity via integrated SHAP value waterfall plots for every prediction',
      'Handled class imbalance with SMOTE-NC without compromising false-positive safety thresholds',
    ],
    architectureOverview:
      'Raw applicant inputs are preprocessed through an Scikit-learn Pipeline (imputation, categorical encoding, quantile transformer). The vector feeds an XGBoost gradient boosted ensemble; feature contributions are computed in real time using TreeSHAP.',
    simulatorConfig: {
      type: 'loan',
      title: 'Loan Risk Assessment Simulator',
      description: 'Adjust financial profile parameters to simulate real-time model underwriting decision and risk tier.',
    },
    gradientTheme: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accentColor: '#F97316',
  },
  {
    id: 'food-calorie',
    title: 'Food Recognition & Calorie Estimation',
    tagline: 'Computer vision pipeline for meal segmentation and macronutrient estimation',
    description:
      'A deep learning vision pipeline that classifies meal dishes from photographs and computes estimated calorie and macronutrient breakdown. Leverages OpenCV image enhancement, bounding contours, and custom CNN transfer learning.',
    category: 'computer-vision',
    categoryLabel: 'Computer Vision',
    tags: ['CNN', 'OpenCV', 'PyTorch', 'Transfer Learning', 'Python'],
    metrics: [
      { label: 'Top-1 Accuracy', value: '89.6%' },
      { label: 'Dish Classes', value: '101 Foods' },
      { label: 'Inference Speed', value: '62ms' },
    ],
    githubUrl: 'https://github.com/YogananthJ/Food-Recognition-And-Calorie-Estimation',
    year: '2025',
    highlights: [
      'Integrated adaptive histogram equalization (CLAHE) to handle poor restaurant lighting',
      'Portion volume estimation heuristics derived from relative utensil and plate bounding contours',
      'Generates full macronutrient breakdown (Proteins, Carbs, Fats) cross-referenced with USDA database',
    ],
    architectureOverview:
      'Images undergo OpenCV preprocessing (noise reduction and color normalization). A Convolutional Neural Network extracts spatial feature pyramids, followed by softmax classification and portion-to-calorie mapping lookup.',
    simulatorConfig: {
      type: 'food',
      title: 'Computer Vision Calorie Classifier',
      description: 'Select meal samples to observe bounding box detection, classification confidence, and nutritional analysis.',
    },
    gradientTheme: 'from-emerald-500/20 via-green-500/10 to-transparent',
    accentColor: '#10B981',
  },
  {
    id: 'event-platform',
    title: 'Full-Stack Event Management Platform',
    tagline: 'Modern event ticketing, real-time RSVP tracking, and secure check-in system',
    description:
      'Production-grade full-stack web application designed for organizing conferences and community events. Features authenticated user roles, Stripe payment integration for tier passes, dynamic attendee dashboards, and digital QR check-in.',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Web',
    tags: ['React', 'Node.js', 'Flask', 'Clerk Auth', 'Stripe', 'Tailwind'],
    metrics: [
      { label: 'Checkout Success', value: '99.8%' },
      { label: 'Lighthouse Score', value: '98/100' },
      { label: 'Auth Methods', value: 'OAuth + Magic' },
    ],
    githubUrl: 'https://github.com/YogananthJ/event-management',
    year: '2025',
    highlights: [
      'Engineered resilient webhook pipeline with Stripe for instantaneous ticket issuance',
      'Built interactive seat tier selection with real-time availability updates',
      'Integrated Clerk authentication supporting role-based access for organizers and attendees',
    ],
    architectureOverview:
      'Responsive React frontend communicating with Node.js and Flask backend services. Payments handled through Stripe Webhooks, while Clerk enforces multi-tenant identity verification and QR verification.',
    simulatorConfig: {
      type: 'event',
      title: 'Interactive Ticket & RSVP Builder',
      description: 'Generate dynamic event passes with custom ticket tiers and instant scannable QR ticket preview.',
    },
    gradientTheme: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    accentColor: '#3B82F6',
  },
  {
    id: 'wildfire-detection',
    title: 'Wildfire Hotspot Detection',
    tagline: 'Satellite thermal imagery classifier using deep convolutional networks',
    description:
      'An early-warning satellite classifier that analyzes multi-spectral thermal and optical imagery to detect active wildfire hotspots. Employs DenseNet architecture for feature reuse and geospatial bounding to aid emergency response coordinators.',
    category: 'computer-vision',
    categoryLabel: 'Computer Vision',
    tags: ['DenseNet', 'CNN', 'PyTorch', 'GeoSpatial', 'Flask'],
    metrics: [
      { label: 'Hotspot Recall', value: '96.4%' },
      { label: 'Resolution', value: '30m Multi-band' },
      { label: 'False Alarm Rate', value: '< 2.1%' },
    ],
    githubUrl: 'https://github.com/YogananthJ/Wildfire_Detection',
    year: '2025',
    highlights: [
      'DenseNet-121 backbone utilizing dense connectivity layers to preserve subtle thermal gradients',
      'Processed multi-spectral bands (Shortwave Infrared + Thermal) to distinguish smoke from cloud cover',
      'Geospatial coordinate mapping with automated GeoJSON export for emergency GIS dashboards',
    ],
    architectureOverview:
      'Satellite raster tiles are parsed into normalized multi-band tensors. DenseNet extracts high-frequency spectral gradients to output thermal anomaly probabilities and geographic bounding masks.',
    simulatorConfig: {
      type: 'wildfire',
      title: 'Satellite Spectral Anomaly Viewer',
      description: 'Toggle spectral bands (Visible RGB vs Thermal Infrared) and inspect active hotspot confidence masks.',
    },
    gradientTheme: 'from-rose-500/20 via-red-500/10 to-transparent',
    accentColor: '#E11D48',
  },
  {
    id: 'supply-chain',
    title: 'Global Supply Chain Analytics',
    tagline: 'Predictive logistics dashboard tracking demand volatility and inventory risk',
    description:
      'Advanced enterprise analytics platform visualizing end-to-end supply chain logistics. Predicts shipment delays, optimizes buffer inventory levels, and identifies transit vulnerabilities across international transport corridors.',
    category: 'data-analytics',
    categoryLabel: 'Data Analytics',
    tags: ['Python', 'Pandas', 'Predictive Modeling', 'Data Analytics', 'Plotly'],
    metrics: [
      { label: 'Delay Accuracy', value: '91.8%' },
      { label: 'Cost Reduction', value: '14.2%' },
      { label: 'Nodes Monitored', value: '120+ Corridors' },
    ],
    githubUrl: 'https://github.com/YogananthJ/Global_Supply_Chain_Analysis',
    year: '2024',
    highlights: [
      'Identified weather and port congestion correlation using historical freight arrival datasets',
      'Created dynamic safety stock threshold calculator based on supplier lead-time variance',
      'Interactive executive dashboards highlighting critical freight risk bottlenecks',
    ],
    architectureOverview:
      'ETL pipeline aggregates shipping telemetry, order histories, and weather APIs. An analytics engine models lead-time probability distributions to compute risk indices across global shipment legs.',
    simulatorConfig: {
      type: 'supply-chain',
      title: 'Logistics Corridor Risk Tester',
      description: 'Select trade corridors to assess transit delay probabilities, buffer safety stock, and risk factors.',
    },
    gradientTheme: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    accentColor: '#06B6D4',
  },
  {
    id: 'pdf-rag',
    title: 'PDF RAG Intelligent Assistant',
    tagline: 'Retrieval-Augmented Generation system with semantic vector search & citations',
    description:
      'An enterprise document question-answering system powered by Llama 3.1 and dense vector embeddings. Allows users to upload lengthy PDF documentation and receive accurate, grounded answers accompanied by exact page and sentence citations.',
    category: 'genai-nlp',
    categoryLabel: 'Generative AI',
    tags: ['Python', 'Llama 3.1', 'Vector DB', 'RAG', 'LangChain', 'FastAPI'],
    metrics: [
      { label: 'Retrieval Latency', value: '< 180ms' },
      { label: 'Hallucination Check', value: 'Strict Grounding' },
      { label: 'Embedding Model', value: 'BGE-Large' },
    ],
    githubUrl: 'https://github.com/YogananthJ/PDF-RAG-Chatbot',
    year: '2025',
    highlights: [
      'Recursive character and table-aware document chunking to preserve context across page breaks',
      'Hybrid search combining BM25 keyword matching with dense vector cosine similarity',
      'Verifiable citations with page coordinates highlighting exact source paragraphs',
    ],
    architectureOverview:
      'PDFs are converted into clean text tokens and embedded via BGE-Large into a high-dimensional vector store. User queries trigger hybrid vector retrieval; top matches are re-ranked and formatted into prompt context for Llama 3.1.',
    simulatorConfig: {
      type: 'rag',
      title: 'Semantic Vector Retrieval Sandbox',
      description: 'Query technical document samples to view vector cosine similarities, retrieved passages, and cited answers.',
    },
    gradientTheme: 'from-purple-500/20 via-violet-500/10 to-transparent',
    accentColor: '#8B5CF6',
  },
  {
    id: 'cognitive-ai',
    title: 'Cognitive-Aware Conversational AI',
    tagline: 'Emotion-sensitive dialog agent that detects user hesitation & cognitive state',
    description:
      'A context-aware conversational agent that evaluates not just what the user says, but cognitive signals such as input latency, hesitation pauses, sentiment polarity, and confidence metrics to dynamically tune tone and explanation depth.',
    category: 'genai-nlp',
    categoryLabel: 'Generative AI & NLP',
    tags: ['Python', 'NLP', 'Sentiment Analysis', 'Transformers', 'FastAPI'],
    metrics: [
      { label: 'Emotion Categories', value: '7 States' },
      { label: 'Hesitation Detect', value: 'Real-time' },
      { label: 'Adaptive Responses', value: 'Dynamic Tone' },
    ],
    githubUrl: 'https://github.com/YogananthJ/Cognitive-Aware-AI-Chatbot',
    year: '2025',
    highlights: [
      'RoBERTa fine-tuned for nuanced sentiment classification (frustration, uncertainty, confidence)',
      'Temporal keystroke and pause analysis identifying user hesitation before submitting queries',
      'Dynamic prompt conditioning that provides empathetic simplifications when confusion is flagged',
    ],
    architectureOverview:
      'Client captures keystroke cadence and pauses. The backend pipeline runs multi-head sentiment analysis, maps cognitive states, and feeds a tuned prompt system that modulates response verbosity and tone.',
    simulatorConfig: {
      type: 'cognitive',
      title: 'Cognitive State & Empathy Evaluator',
      description: 'Enter varied prompts or test presets to visualize real-time sentiment polarity, cognitive stress, and adaptive tone.',
    },
    gradientTheme: 'from-pink-500/20 via-rose-500/10 to-transparent',
    accentColor: '#EC4899',
  },
];

export const SKILL_CATEGORIES: SkillCategoryItem[] = [
  {
    category: 'AI & Machine Learning',
    description: 'Statistical modeling, deep learning architectures, and modern foundation models',
    skills: [
      { name: 'Machine Learning', level: 'Advanced', usedIn: ['loan-approval', 'supply-chain'] },
      { name: 'XGBoost & Ensembles', level: 'Advanced', usedIn: ['loan-approval'] },
      { name: 'Convolutional Neural Networks (CNN)', level: 'Advanced', usedIn: ['food-calorie', 'wildfire-detection'] },
      { name: 'DenseNet & Transfer Learning', level: 'Proficient', usedIn: ['wildfire-detection', 'food-calorie'] },
      { name: 'Generative AI & Prompt Design', level: 'Advanced', usedIn: ['pdf-rag', 'cognitive-ai'] },
      { name: 'RAG Architecture & Embeddings', level: 'Advanced', usedIn: ['pdf-rag'] },
      { name: 'Computer Vision (OpenCV)', level: 'Proficient', usedIn: ['food-calorie'] },
      { name: 'SHAP & Model Explainability', level: 'Proficient', usedIn: ['loan-approval'] },
    ],
  },
  {
    category: 'Languages & Core',
    description: 'Robust programming languages used for backend services, algorithms, and models',
    skills: [
      { name: 'Python', level: 'Advanced', usedIn: ['loan-approval', 'food-calorie', 'wildfire-detection', 'supply-chain', 'pdf-rag', 'cognitive-ai'] },
      { name: 'JavaScript (ES6+)', level: 'Advanced', usedIn: ['event-platform'] },
      { name: 'TypeScript', level: 'Proficient', usedIn: ['event-platform'] },
      { name: 'Java', level: 'Proficient', usedIn: [] },
      { name: 'SQL', level: 'Proficient', usedIn: ['supply-chain', 'event-platform'] },
    ],
  },
  {
    category: 'Web & Full Stack',
    description: 'Frontend frameworks, responsive architecture, and production backend APIs',
    skills: [
      { name: 'React', level: 'Advanced', usedIn: ['event-platform'] },
      { name: 'Node.js & Express', level: 'Proficient', usedIn: ['event-platform'] },
      { name: 'Flask & FastAPI', level: 'Advanced', usedIn: ['loan-approval', 'wildfire-detection', 'pdf-rag'] },
      { name: 'Tailwind CSS', level: 'Advanced', usedIn: ['event-platform'] },
      { name: 'RESTful API Engineering', level: 'Advanced', usedIn: ['event-platform', 'pdf-rag'] },
      { name: 'Authentication (Clerk / JWT)', level: 'Proficient', usedIn: ['event-platform'] },
      { name: 'Stripe Payment Webhooks', level: 'Proficient', usedIn: ['event-platform'] },
    ],
  },
  {
    category: 'Data & Analytics',
    description: 'Data transformation, statistical analysis, and interactive dashboarding',
    skills: [
      { name: 'Data Analytics & Modeling', level: 'Advanced', usedIn: ['supply-chain', 'loan-approval'] },
      { name: 'Pandas & NumPy', level: 'Advanced', usedIn: ['loan-approval', 'supply-chain'] },
      { name: 'Microsoft Excel (Advanced)', level: 'Proficient', usedIn: ['supply-chain'] },
      { name: 'Plotly & Data Visualization', level: 'Proficient', usedIn: ['supply-chain'] },
    ],
  },
  {
    category: 'Tools & DevOps',
    description: 'Version control, developer tooling, automation, and workflow scripting',
    skills: [
      { name: 'Git & GitHub', level: 'Advanced', usedIn: ['All Projects'] },
      { name: 'Google Apps Script (Automation)', level: 'Advanced', usedIn: [] },
      { name: 'UI / UX Design & Prototyping', level: 'Proficient', usedIn: ['event-platform'] },
      { name: 'Linux / Bash Tooling', level: 'Proficient', usedIn: [] },
    ],
  },
];

export const TIMELINE: ExperienceItem[] = [
  {
    period: '2024 — Present',
    role: 'AI & Web Application Developer',
    organization: 'Independent Projects & Open Source',
    location: 'India',
    summary: 'Designing and deploying specialized AI models, web platforms, and automated developer tooling.',
    achievements: [
      'Developed 7+ end-to-end applications integrating PyTorch, XGBoost, and full-stack web frameworks.',
      'Constructed RAG systems using Llama 3.1 and vector embeddings for semantic document processing.',
      'Authored clean, documented open-source repositories with CI/CD and interactive interfaces.',
    ],
    technologies: ['Python', 'PyTorch', 'React', 'FastAPI', 'XGBoost', 'Docker'],
  },
  {
    period: '2023 — 2024',
    role: 'Software & Automation Enthusiast',
    organization: 'Academic & Hackathon Initiatives',
    location: 'India',
    summary: 'Focused on algorithmic problem solving, automated data collection, and applied computer science.',
    achievements: [
      'Automated administrative workflows with Google Apps Script and custom webhooks.',
      'Built early computer vision prototypes utilizing OpenCV contour mapping and image segmentation.',
      'Analyzed enterprise datasets to forecast logistical constraints and inventory bottlenecks.',
    ],
    technologies: ['Python', 'OpenCV', 'JavaScript', 'Google Apps Script', 'Excel'],
  },
];
