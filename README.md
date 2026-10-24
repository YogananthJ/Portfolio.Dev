# Yogananth J — Developer & Aspiring AI Engineer Portfolio

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=white)](https://greensock.com/)
[![Certifications](https://img.shields.io/badge/Anthropic_Claude-101_&_Code-D97706)](https://anthropic.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Associate_Developer-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> **Developer Identity:** Yogananth J  
> **Role & Focus:** Developer & Aspiring AI Engineer actively exploring modern AI tools, LLM prompting, agentic orchestration (CrewAI), RAG architectures, and full-stack web platforms.  
> **Career Status & Transparency:** No commercial industry employment. All works presented are verified academic coursework, personal self-directed builds, hackathon achievements (Top 60 Finalist at Vibeathon 6.0), or official technical certifications.  
> **Live Deployments:**
> - Cognitive-Aware AI (Streamlit Cloud): [https://cognitive-core-ai.streamlit.app/](https://cognitive-core-ai.streamlit.app/)
> - CareerPilot AI Mentor (Telegram Bot): [@CareerPilotAgent2026_bot](https://t.me/CareerPilotAgent2026_bot)
> - GitHub Repositories: [https://github.com/YogananthJ](https://github.com/YogananthJ)

---

## 1. Executive Summary & Design System

This repository contains the interactive portfolio and developer command center of **Yogananth J**. Engineered with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **GSAP 3**, it functions as an interactive command center rather than a static resume site.

### Key Architectural Capabilities
- **Interactive System Architecture Explorer:** Node-and-edge visualizer dissecting client UIs, backends, AI models, third-party APIs, and databases with interactive zoom, pan, component inspection, and an accessible structured list fallback.
- **AI Project Labs & Simulators:** Dedicated sandboxes strictly for AI projects (PDF RAG, CrewAI Resume Parser, Cognitive Empathy Cadence, CareerPilot Bot, and Multi-Spectral Satellite Anomaly Detection).
- **Recruiter Transparency Standard:** Explicit separation between client-side interactive demonstrators (which illustrate mathematical heuristics without live API keys) and verified live production services (Streamlit Community Cloud and Telegram Bot API).
- **Dual-Pane Split-Screen Workbench:** Flexible side-by-side workspace with adjustable split ratios (40/60, 50/50, 60/40), enabling simultaneous project inspection and simulation.
- **Interactive Developer CLI Terminal:** Fully featured console with 25+ real commands (`architecture <name>`, `about`, `skills`, `projects`, `certifications`, `timeline`, `matrix`, `neofetch`, etc.), autocomplete (`Tab`), command history (`↑`/`↓`), and global hotkey isolation.
- **Theme Studio with Persistence:** Light, Dark, and System appearance modes paired with 4 accent themes (Signal Red, Electric Blue, Forest Green, Violet) persisted to `localStorage`.

---

## 2. Verified Project Catalog & Methodologies

The portfolio indexes 10 complete builds organized into four transparent taxonomy tiers:

### A. Hackathon Projects
1. **Restaurant Nerve Center (Vibeathon 6.0 — Top 60 Solo Finalist)**
   - *Overview:* Autonomous kitchen inventory depletion and order triage cockpit built under a 48-hour sprint.
   - *Tech Stack:* Lovable, Claude, ChatGPT, Playwright, GitHub.
   - *Verification:* End-to-end order processing tested and verified using headless Playwright suites to ensure zero drop under high queue load.

### B. Personal Generative AI & Agent Projects
2. **Cognitive-Aware Conversational AI**
   - *Overview:* Adaptive dialog assistant modulating tone and explanation depth based on user keystroke cadence and sentiment polarity.
   - *Live Deployment:* Publicly hosted on [Streamlit Cloud](https://cognitive-core-ai.streamlit.app/).
   - *Tech Stack:* Python, Transformers, RoBERTa (`roberta-base-go_emotions`), Streamlit, FastAPI.
   - *Simulator:* Interactive emotion detection and hesitation pause evaluator.

3. **CareerPilot AI Agent**
   - *Overview:* Stateful career advisory agent operating via Telegram Bot API that interviews candidates and generates structured weekly skill roadmaps.
   - *Live Deployment:* Operational 24/7 on Telegram via [@CareerPilotAgent2026_bot](https://t.me/CareerPilotAgent2026_bot).
   - *Tech Stack:* Python, Telegram Bot API, Claude API, OpenAI.
   - *Simulator:* Client-side agent interview questionnaire and markdown roadmap synthesizer.

4. **PDF RAG Intelligent Assistant**
   - *Overview:* Semantic question-answering pipeline using Llama 3.1 and dense embeddings with strict source citation verification.
   - *Tech Stack:* Python, Llama 3.1, FAISS, BGE-Large embeddings (`bge-large-en-v1.5`), LangChain, FastAPI.
   - *Simulator:* Interactive vector chunk similarity search with grounded page coordinate display.

5. **CrewAI Multi-Agent Resume Parser**
   - *Overview:* Agentic orchestration delegating tasks across 3 autonomous roles: Entity Extractor, Role Matcher, and Skill Gap Analyst.
   - *Tech Stack:* Python, CrewAI framework, Claude API, OpenAI.
   - *Simulator:* Visual step-by-step trace showing inter-agent message passing and deterministic JSON generation.

### C. Academic Coursework Projects
6. **Wildfire Hotspot Detection (Deep Learning Coursework)**
   - *Overview:* Satellite multi-spectral image classifier leveraging DenseNet-121 to isolate thermal infrared hotspots through smoke.
   - *Evaluation:* 96.4% recall on test split of benchmark satellite raster tiles; 2.1% false alarm rate on cloud-edge noise.
   - *Tech Stack:* PyTorch, DenseNet-121, OpenCV, GeoTIFF processing.
   - *Simulator:* Multi-band spectral channel toggle (Visible RGB vs SWIR vs TIR).

7. **Loan Approval Prediction (Machine Learning Coursework)**
   - *Overview:* Credit risk underwriting classifier comparing Logistic Regression against tuned XGBoost ensembles with TreeSHAP explainability.
   - *Evaluation Conditions:* Benchmark dataset of 4,269 applicant records evaluated on an 80/20 train/test holdout. Baseline Logistic Regression achieved 81.8% recall; tuned XGBoost with engineered Debt-to-Income ratios achieved 94.2% recall (12.4% net recall gain).
   - *Tech Stack:* Python, Scikit-Learn, XGBoost, SHAP, SMOTE-NC.

8. **Food Recognition & Calorie Estimation (Computer Vision Coursework)**
   - *Overview:* CNN dish classifier combining OpenCV CLAHE illumination normalization with portion contour heuristics.
   - *Evaluation:* 89.6% Top-1 accuracy evaluated on Food-101 benchmark splits.
   - *Tech Stack:* PyTorch, OpenCV, Transfer Learning.

9. **Global Supply Chain Analytics (Data Analytics Coursework)**
   - *Overview:* Corridors lead-time delay variance modeling and buffer safety stock optimization.
   - *Tech Stack:* Python, Pandas, NumPy, Plotly.

### D. Personal Full-Stack Projects
10. **Full-Stack Event Management Platform**
    - *Overview:* Production-grade event ticketing platform with Clerk OAuth, Stripe checkout webhooks, and digital QR ticket verification.
    - *Evaluation:* 98/100 Google Lighthouse performance score.
    - *Tech Stack:* React, Node.js, Express, Flask, Clerk Auth, Stripe Webhooks, Tailwind CSS.

---

## 3. Verified Skills & Certifications

### Official Industry Certifications
- **Claude 101 — Anthropic (2025):** Core LLM capabilities, context window management, prompt structuring, few-shot conditioning, and safety alignment.
- **Claude Code 101 — Anthropic (2025):** AI-assisted software development, agentic CLI workflows, automated codebase navigation, and refactoring.
- **MongoDB Associate Developer — MongoDB (2025):** Document data modeling, multi-stage aggregation pipelines, index tuning, and Atlas vector search.

### 7 Verified Skill Categories
1. **Languages:** Python (Core), JavaScript ES6+ (Core), TypeScript (Core), SQL (Proficient), Java (Proficient).
2. **AI & Machine Learning:** Machine Learning, Deep Learning (CNNs), Generative AI, RAG Architecture, Computer Vision (OpenCV), LLM Prompting.
3. **Modern AI Tools & Agent Frameworks:** Claude (Anthropic), Claude Code CLI, ChatGPT / OpenAI APIs, CrewAI (Multi-Agent Systems), Lovable (AI Full-Stack), Streamlit (ML Deployment).
4. **Web Development:** React 19, Next.js, Node.js, Express, HTML5 & CSS3, Tailwind CSS, REST APIs.
5. **Databases & Vector Stores:** MongoDB (Certified), PostgreSQL, Vector Databases (FAISS), ChromaDB.
6. **Developer Tools & Methodologies:** Git & GitHub, Playwright (E2E Testing), Google Apps Script, Vite, Postman, Linux CLI.
7. **Currently Learning / Exploring:** AI Agents & Multi-Agent Orchestration (CrewAI, LangGraph), Model Evaluation & Fine-Tuning, Advanced RAG Patterns, Production LLM Deployment, Prompt Engineering & System Design.

---

## 4. Developer Terminal Command Catalog

The terminal can be opened using `⌘K` (Mac), `Ctrl+K` (Windows/Linux), or by clicking the **CLI** button in the header.

| Command | Arguments | Description | Example |
| :--- | :--- | :--- | :--- |
| `help` | — | Displays the full interactive command directory | `help` |
| `about` / `whoami` | — | Developer background, career focus, and contact | `about` |
| `projects` | — | Lists all 10 verified projects with IDs and categories | `projects` |
| `project` | `<id>` | Deep inspection of an individual project | `project cognitive-ai` |
| `architecture` | `[name]` | Opens system schematics or outputs node/edge data | `architecture pdf-rag` |
| `certifications` | — | Displays verified credentials from Anthropic and MongoDB | `certifications` |
| `education` | — | Academic computer science foundations | `education` |
| `learning` / `currently` | — | Active engineering experiments and studies | `learning` |
| `lab` / `live` | — | Lists interactive AI labs and direct live URLs | `lab` |
| `timeline` | — | Chronological milestones (hackathons, builds, certs) | `timeline` |
| `skills` | — | Categorized skill matrices across all 7 domains | `skills` |
| `stack` | — | Daily-driver programming toolchain | `stack` |
| `github` | — | Link to all open-source repositories | `github` |
| `socials` / `contact` | — | Direct email, LinkedIn, and GitHub links | `socials` |
| `manifesto` | — | 4 core engineering principles | `manifesto` |
| `matrix` | — | Launches interactive Matrix digital rain canvas | `matrix` |
| `theme` | `[name]` | Switches terminal palette (`matrix`, `cyberpunk`, `dracula`, `amber`) | `theme cyberpunk` |
| `echo` | `<text>` | Echoes input text | `echo hello world` |
| `history` | — | Displays commands entered during current session | `history` |
| `date` / `uptime` | — | Current IST time and session uptime counter | `date` |
| `clear` | — | Clears the terminal output buffer | `clear` |

---

## 5. Local Setup & Development Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher (Node 20+ recommended)
- **Package Manager:** npm (v9+) or pnpm

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/YogananthJ/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will spin up at **`http://localhost:3000`**.

### Available Scripts
```bash
npm run dev      # Launches Vite development server on port 3000 (host: 0.0.0.0)
npm run build    # Compiles production TypeScript bundle to dist/
npm run preview  # Previews production build locally
npm run lint     # Validates TypeScript compilation with zero emitted output (tsc --noEmit)
npm run clean    # Cleans build artifacts (dist/)
```

---

## 6. Project Structure

```
├── public/
│   └── assets/aistudio/favicon_507da8ac.png   # Developer avatar & favicon asset
├── src/
│   ├── components/
│   │   ├── ArchitectureExplorer.tsx           # Interactive SVG/Canvas node-and-edge visualizer
│   │   ├── ContactSection.tsx                 # Contact form & social connections
│   │   ├── ExperienceSection.tsx              # Milestones, timeline & verified certifications
│   │   ├── Footer.tsx                         # Colophon and license footer
│   │   ├── Header.tsx                         # 3-zone sticky navigation with mobile drawer
│   │   ├── Hero.tsx                           # Monolithic hero with portrait, GSAP kinetic typography & code console
│   │   ├── LayoutController.tsx               # Floating theme studio (Light/Dark/System + 4 accents) & layout modes
│   │   ├── MatrixRainCanvas.tsx               # Canvas digital rain stream animation
│   │   ├── ProjectCard.tsx                    # Individual project card with taxonomy badges & SVG schematics
│   │   ├── ProjectModal.tsx                   # Deep-dive inspector with methodology notes & AI simulator
│   │   ├── ProjectShowcase.tsx                # Filterable project showcase (Grid, List, Bento views)
│   │   ├── ProjectSimulator.tsx               # Interactive client-side sandboxes strictly for AI projects
│   │   ├── SimulatorsSection.tsx              # AI Project Labs container with recruiter transparency notice
│   │   ├── SkillsSection.tsx                  # 7-domain technical matrix with instant search
│   │   ├── SplitScreenWorkspace.tsx           # Dual-pane workbench with customizable split ratios
│   │   ├── TerminalDrawer.tsx                 # Full-featured 25+ command CLI with autocomplete
│   │   └── WorkspaceSidebar.tsx               # Directory drawer for quick navigation
│   ├── context/
│   │   └── LayoutContext.tsx                  # Workspace layout, theme, and accent state with localStorage
│   ├── data/
│   │   ├── architectureData.ts                # Structured node/edge data & text flows for 6 systems
│   │   ├── portfolioData.ts                   # Verified projects, skills, certifications, and milestones
│   │   └── terminalData.ts                    # Command registry, themes, ASCII art, and changelogs
│   ├── types/
│   │   ├── architecture.ts                    # Node, edge, and system architecture interfaces
│   │   ├── layout.ts                          # Layout, appearance, and accent theme types
│   │   ├── portfolio.ts                       # ProjectItem, SkillItem, CertificationItem, MilestoneItem
│   │   └── terminal.ts                        # Terminal theme definitions
│   ├── utils/
│   │   └── gsapAnimations.ts                  # GSAP 3.15 kinetic typography, tilt, and scroll staggers
│   ├── App.tsx                                # Root application entry orchestrating sections
│   ├── index.css                              # Tailwind CSS v4 entry & CSS variables for themes
│   └── main.tsx                               # React 19 root DOM mount
├── index.html                                 # HTML entry point with metadata and favicon
├── metadata.json                              # Applet metadata and capabilities
├── package.json                               # Dependencies and scripts
├── tsconfig.json                              # Strict TypeScript configuration
└── vite.config.ts                             # Vite build configuration
```

---

## 7. License & Credits

- **Author:** Yogananth J
- **License:** MIT License
- **Live Demo:** [https://cognitive-core-ai.streamlit.app/](https://cognitive-core-ai.streamlit.app/)
- **Telegram Bot:** [@CareerPilotAgent2026_bot](https://t.me/CareerPilotAgent2026_bot)
