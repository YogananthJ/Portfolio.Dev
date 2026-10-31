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

## 7. Real-Time Portfolio Visitor Counter (Firebase Firestore + Framer Motion)

The portfolio incorporates an integrated live visitor analytics monitor in the footer (`src/components/VisitorCounter.tsx`) backed by **Google Cloud Firebase Firestore**.

### Architecture & Data Flow
1. **Cloud Firestore Collection:**
   - Collection: `analytics`
   - Document ID: `visitors`
   - Schema: `{ count: number, lastUpdated: string }`
2. **Persistent De-Duplication Protocol (`localStorage`):**
   - **Persistent Visitor UUID:** Each browser is assigned a cryptographically generated UUID (`portfolio_unique_visitor_id`).
   - **Pre-Flight Recording Guard:** When a user arrives, `localStorage.getItem('portfolio_visitor_recorded_v1')` is checked.
     - **Recorded Browser:** If already flagged as `'true'`, the component only performs a read/listen operation via `onSnapshot` and **never increments the database**. Closing and reopening the browser, hard-refreshing (`F5`), or navigating between portfolio tabs/sections does not increment the count.
     - **New Browser:** The flag is synchronously set to `'true'` immediately before the asynchronous Firestore transaction to guarantee that React double-invocations (StrictMode), rapid refreshes, or simultaneous multi-tab opens cannot trigger duplicate increments.
3. **Smooth Count-Up Motion:**
   - Numbers transition using Framer Motion’s `animate` utility with an exponential ease-out curve (`[0.16, 1, 0.3, 1]`), creating an authentic tally roll without layout jumps.
4. **Security Hardening (`firestore.rules`):**
   - **Monotonic Increment Guard:** `request.resource.data.count >= resource.data.count` strictly forbids decreasing or resetting the count.
   - **Rate Abuse & Inflation Prevention:** `request.resource.data.count <= resource.data.count + 5` prevents malicious actors from injecting massive arbitrary counts.
   - **Zero Deletes Allowed:** `allow delete: if false;` blocks destructive attempts.
   - **Schema Blueprint:** Validates allowed keys (`count`, `lastUpdated`), type constraints (`number`), and positive boundaries.

### Limitations of Browser-Based Unique Visitor Tracking
- **Private / Incognito Browsing:** Browser privacy modes isolate `localStorage` to the private session and flush it entirely upon closing the window, meaning subsequent private sessions will be treated as new browsers.
- **Cache & Storage Purging:** If a visitor manually clears site data, cookies, or browser storage, the persistent token is removed and a fresh ID will be generated on their next visit.
- **Cross-Device & Cross-Browser Disconnection:** A single individual accessing the portfolio from Chrome on desktop and Safari on mobile will register as two distinct unique browsers, as client-side tokens cannot bridge disparate browser sandboxes without authenticated universal accounts.
- **Strict Privacy Blockers:** Extreme script blockers blocking Firestore WebSocket/REST domains fall back to client-cached baseline estimates to prevent UI degradation.

---

## 8. Creative, Futuristic & Interactive Experience Enhancements

The portfolio has been elevated into a distinctive, futuristic digital experience designed specifically for an AI Engineer, Full-Stack Developer, and Automation Specialist.

### 1. Immersive Hero, Latent Vector Field & Neural Pipeline
- **Interactive Latent Vector Space & Synapse Projection Field:** High-performance HTML5 Canvas modeling 4 anchored semantic engineering clusters (`Agentic Orchestration`, `Dense Vector RAG`, `Full-Stack Reactive`, and `Deep Learning Vision`). Features organic Brownian motion, real-time cosine proximity calculations (`cos_θ: 0.942`), vector projection rays, and click-triggered shockwaves.
- **Dual Console Mode Switcher:** Instant toggling between the live SVG **Neural Pipeline Visualizer** (streaming user token tensors into FAISS cosine search and CrewAI sequential handoffs) and the interactive **Code Runtime** Python simulator.
- **Framer Motion Text Reveals:** Staggered entrance animations for typography, mission statements, and engineering radar metrics.
- **Scroll Explorer Indicator:** Visual downward guidance encouraging visitors to dive into the 10 verified systems.

### 2. Interactive Projects Showcase, 3D Tilt & X-Ray Blueprint Lens
- **Hardware-Accelerated 3D Card Tilt:** Interactive `rotateX` and `rotateY` physics responding dynamically to cursor position, accompanied by radial hover light reflections.
- **Interactive Architecture X-Ray Blueprint Lens:** Every project card features a tactile `[X-RAY]` toggle that transforms the card banner into a topological system schematic with animated multi-stage data pipelines (e.g. *Trigger -> Neural Model -> Vector Sink*), live latency telemetry, and subsystem responsibilities.
- **Deterministic Lifecycle Execution Trace (`ProjectModal.tsx`):** Every project detail window provides a 4-phase interactive state trace (`Ingestion`, `Middleware & RBAC`, `Core Model Inference`, `Dispatch & Sink`) with latency budgets and verification proofs.
- **Category Filter Tabs:** Fluid switching between Hackathon prototypes, Generative AI & Agents, Academic Deep Learning models, and Full-Stack platforms.
- **Direct Interactive Sandboxes:** Instant launcher buttons connecting directly to client-side heuristic simulators and verified live deployments (Streamlit Community Cloud & Telegram Bot).

### 3. Technology Constellation & Skill Synergies
- **Inter-Disciplinary Bridge Cards:** Visualizes cross-cutting relationships between AI, Full-Stack development, and Intelligent Automation.
- **Interactive Filterable Technology Grid:** 7 specialized domains with real-time text search, depth classification (`Core Specialization`, `Proficient / Production`, `Exploring`), and verified project associations.

### 4. Real-Time GitHub Activity & Open-Source Telemetry (`GitHubActivitySection.tsx`)
- **Direct GitHub REST API v3 Integration:** Connects to public endpoints (`/users/YogananthJ`, `/repos`, `/events/public`) without exposing personal access tokens.
- **Live Metrics Dashboard:**
  - **Total Public Repositories:** Real-time count (28) with Framer Motion ease-out tally animation.
  - **Stars Earned:** Summed dynamically across all public repositories.
  - **Top 5 Programming Languages:** Computed language distribution breakdown with GitHub language palette badges (TypeScript 38%, HTML 15%, Python 12%, CSS 8%, Jupyter Notebook 8%).
  - **Public Event Stream:** Live stream of recent push events, commit SHAs, and active repositories (`Portfolio.Dev`, `Leetcode-Prob`).
- **Resilient Caching Protocol:** Caches API payloads in `localStorage` with a 30-minute expiration window to respect GitHub's 60 req/hr unauthenticated rate limit, accompanied by a manual `[REFRESH]` button.

### 5. Visual Storytelling Timeline & Certifications
- **Collapsible Chronological Journey:** Interactive milestone cards detailing academic milestones, hackathons, and personal builds with verified proof links.
- **Official Industry Credentials:** Direct verification badges for **Anthropic Claude 101**, **Claude Code 101**, and **MongoDB Associate Developer**.

### 6. Ambient Microinteractions, Tactile Sound & Navigation
- **Kinetic Precision Reticle Cursor HUD (`FuturisticSpotlight.tsx`):** Lerp-interpolated dynamic targeting reticle with magnetic snapping to buttons, links, canvases, and cards, complete with contextual micro-labels (`[SYSTEM // SCHEMATIC]`, `[PHYSICS // DRAG]`).
- **Tactile Procedural Audio Synthesizer (`src/utils/soundEffects.ts`):** High-fidelity Web Audio API engine synthesizing physical micro-clicks, cybernetic frequency sweeps, and harmonic chimes with 0kb external audio file overhead. Muted by default with an instant audio toggle in the header navigation.
- **Scroll Progress Indicator (`ScrollProgressBar.tsx`):** Fixed electric-accent progress bar showing exact viewport scroll depth.
- **Floating Back-to-Top Navigation (`BackToTop.tsx`):** Spring-animated quick navigation button appearing when scrolled past 450px.

---

## 9. License & Credits

- **Author:** Yogananth J
- **License:** MIT License
- **Live Demo:** [https://cognitive-core-ai.streamlit.app/](https://cognitive-core-ai.streamlit.app/)
- **Telegram Bot:** [@CareerPilotAgent2026_bot](https://t.me/CareerPilotAgent2026_bot)


