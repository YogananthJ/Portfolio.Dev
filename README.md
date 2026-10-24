# Yogananth — Developer Portfolio & Interactive Engineering Lab

> **Production portfolio of Yogananth J**: An editorial neo-brutalist web application, dual-pane developer workbench, and interactive model testing environment showcasing 7 full-stack, machine learning, and computer vision systems.

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14.2-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Python](https://img.shields.io/badge/Python-ML_&_AI-3776AB?logo=python&logoColor=white)](https://www.python.org/)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Visual Presentation & Key Links](#2-visual-presentation--key-links)
3. [Feature Breakdown](#3-feature-breakdown)
4. [Complete Technology Stack](#4-complete-technology-stack)
5. [Project Showcase — All 7 Deployed Systems](#5-project-showcase--all-7-deployed-systems)
   - [01. Loan Approval Prediction](#project-1-loan-approval-prediction)
   - [02. Food Recognition & Calorie Estimation](#project-2-food-recognition--calorie-estimation)
   - [03. Full-Stack Event Management Platform](#project-3-full-stack-event-management-platform)
   - [04. Wildfire Hotspot Detection](#project-4-wildfire-hotspot-detection)
   - [05. Global Supply Chain Analytics](#project-5-global-supply-chain-analytics)
   - [06. PDF RAG Intelligent Assistant](#project-6-pdf-rag-intelligent-assistant)
   - [07. Cognitive-Aware Conversational AI](#project-7-cognitive-aware-conversational-ai)
6. [Repository Structure](#6-repository-structure)
7. [Installation & Local Development](#7-installation--local-development)
8. [Configuration & Environment Variables](#8-configuration--environment-variables)
9. [Design System & UI Architecture](#9-design-system--ui-architecture)
10. [Interactive Developer Terminal Documentation](#10-interactive-developer-terminal-documentation)
11. [Contact & Social Links](#11-contact--social-links)
12. [Deployment Guide](#12-deployment-guide)
13. [Performance, Accessibility & Troubleshooting](#13-performance-accessibility--troubleshooting)
14. [Development & Contribution Guidelines](#14-development--contribution-guidelines)
15. [Roadmap & Future Improvements](#15-roadmap--future-improvements)
16. [License & Credits](#16-license--credits)

---

## 1. Project Overview

This repository houses the personal portfolio and interactive engineering laboratory of **Yogananth J**, an India-based developer specializing in **Machine Learning**, **Computer Vision**, and **Full-Stack Web Engineering**.

### Purpose
Rather than presenting static screenshots or mock cards, this application functions as an active software console. Visitors can test mathematical underwriting equations, tweak computer vision bounding boxes, query document embeddings, analyze logistical corridors, and execute terminal commands natively in the browser.

### Developer Identity
- **Name:** Yogananth J
- **Role:** AI & Full-Stack Engineer
- **Location:** Tamil Nadu, India (Asia/Kolkata timezone)
- **Primary Focus:** Bridging statistical machine learning models (XGBoost, DenseNet, CNNs, Llama 3.1) with production-grade web systems (React 19, TypeScript, FastAPI, Flask, Node.js).
- **Status:** Actively available for Summer/Fall 2026 graduation hiring and full-time software engineering roles.

### Visual Design Philosophy
The interface rejects generic AI templates (gradient pills, unreadable pastel cards, and low-contrast text) in favor of an **editorial neo-brutalist architecture**:
- Warm archival paper canvas (`#F5F2EB`) paired with high-contrast structural ink (`#121212`) and signal crimson accents (`#E11D48`).
- Monolithic typography hierarchy powered by `Archivo Black` display headlines, `Plus Jakarta Sans` body prose, and `JetBrains Mono` tabular figures.
- Tactile paper grid alignment lines and subtle physics-based canvas filaments that react dynamically to cursor movement.

### What Makes This Portfolio Distinctive
1. **Zero-Mock Interactive Simulators:** Every project features a functional client-side mathematical or algorithmic sandbox replicating real model behavior.
2. **Dual-Pane Developer Workbench:** Visitors can toggle a split-screen view to browse the project ledger on the left while simultaneously testing models and diagnostics on the right.
3. **40+ Command Developer Terminal:** A fully keyboard-navigable bash-style terminal (`⌘K`) featuring autocomplete, history recall, custom themes, and an authentic Matrix digital rain sequence.
4. **Resilient Local Assets:** Zero reliance on fragile third-party image CDNs; all visual assets are bundled locally in the repository.

---

## 2. Visual Presentation & Key Links

### Profile Avatar & Favicon
The portfolio prominently features Yogananth's developer character illustration located at:
`/public/assets/aistudio/favicon_507da8ac.png`

This asset is rendered inside an editorial neo-brutalist avatar frame in the Hero section with continuous sine-eased floating motion and interactive 3D magnetic cursor tilt (`attach3DTilt`), and is linked as the website's favicon in `index.html`.

### Verified Key Links
- **GitHub Profile:** [https://github.com/YogananthJ](https://github.com/YogananthJ)
- **LinkedIn Profile:** [https://www.linkedin.com/in/yogananth-j-653400307/](https://www.linkedin.com/in/yogananth-j-653400307/)
- **Primary Contact Email:** [mjyogananth@gmail.com](mailto:mjyogananth@gmail.com)
- **Development App URL:** [https://ais-dev-t3hcsw5nbpyv5t4bxhl7vf-401155713353.asia-southeast1.run.app](https://ais-dev-t3hcsw5nbpyv5t4bxhl7vf-401155713353.asia-southeast1.run.app)
- **Shared App URL:** [https://ais-pre-t3hcsw5nbpyv5t4bxhl7vf-401155713353.asia-southeast1.run.app](https://ais-pre-t3hcsw5nbpyv5t4bxhl7vf-401155713353.asia-southeast1.run.app)

---

## 3. Feature Breakdown

### 1. Dual-Pane Split-Screen Workbench (`SplitScreenWorkspace.tsx`)
- **How to use:** Click the **"Split View"** button in the header or the **"Split-Screen"** button in the floating Layout Studio.
- **Functionality:** 
  - **Left Pane:** Filterable project catalog with live search, category selector, metric badges, and deep-dive modal triggers.
  - **Right Pane:** The active project's live interactive model simulator and architecture inspector.
  - **Adjustable Split Ratio:** Toggle between **40% / 60%**, **50% / 50%**, or **60% / 40%** column widths.

### 2. Layout & Spacing Density Studio (`LayoutController.tsx`)
- **How to use:** Located at the bottom-right corner of the screen.
- **Controls:**
  - **Layout Mode:** Switch between *Editorial Flow* (standard scroll) and *Split Workbench*.
  - **Project Format:** Toggle project showcase between *Grid View*, *Compact Table/Ledger View*, and *Asymmetric Bento View*.
  - **Density:** Switch between *Compact* (tight spacing for data density), *Comfortable* (balanced default), and *Spacious* (relaxed editorial).
  - **Sidebar:** Show or hide the quick-jump directory sidebar.

### 3. Quick-Jump Workspace Sidebar (`WorkspaceSidebar.tsx`)
- **How to use:** Click the sidebar icon in the header or toggle it via the Layout Controller.
- **Functionality:** Provides a docked left-hand drawer to immediately jump between all 7 projects or switch simulator presets without losing page context.

### 4. Interactive Hero Section with Canvas Filaments (`Hero.tsx`)
- **Functionality:**
  - Monolithic `YOGANANTH` display header with real-time India Standard Time (IST) clock.
  - HTML5 Canvas particle constellation that calculates mouse proximity and draws dynamic connecting filaments at 60fps without external library overhead.
  - Interactive multi-tab code console toggling between Machine Learning, Full-Stack, and Computer Vision snippets.
  - Key metrics telemetry strip displaying verified numbers with tabular figures.

### 5. Multi-View Project Showcase (`ProjectShowcase.tsx` & `ProjectCard.tsx`)
- **Functionality:**
  - Category filters (*All Projects*, *Machine Learning*, *Computer Vision*, *Full-Stack Web*, *Data Analytics*, *Generative AI & NLP*).
  - Instant real-time search input matching titles, descriptions, and tech tags.
  - Three distinct render modes:
    - **Grid View:** Responsive cards featuring bespoke SVG vector visualizations representing each model's actual architecture (no broken external images).
    - **List / Ledger View:** High-density engineering table with key metrics, latency benchmarks, and direct GitHub links.
    - **Bento View:** Asymmetric layout highlighting flagship projects.

### 6. Seven Live Interactive Model Simulators (`ProjectSimulator.tsx`)
- Fully interactive sandboxes replicating actual model behavior for all 7 projects. (Detailed in [Section 5](#5-project-showcase--all-7-deployed-systems)).

### 7. Interactive Developer Terminal (`TerminalDrawer.tsx`)
- **How to use:** Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) or click the **"CLI"** button in the header.
- **Functionality:** 40+ executable commands, live `Tab` autocomplete, `↑`/`↓` history navigation, 6 themes, and a Matrix digital rain canvas. (Detailed in [Section 10](#10-interactive-developer-terminal-documentation)).

### 8. Functional Contact Hub (`ContactSection.tsx`)
- **Functionality:**
  - Form validation with pre-written subject templates (*Hiring for Team*, *Project Collaboration*, *Tech Chat*).
  - One-click copy email button with visual confirmation toast.
  - Form submission compiles a formatted `mailto:` action directed to `mjyogananth@gmail.com`.

---

## 4. Complete Technology Stack

The following table documents all verified technologies actively used in this repository based on `package.json`, source imports, and configuration files:

| Technology | Category | Purpose in this Codebase |
|---|---|---|
| **React 19.0.1** | Frontend Framework | Core UI library powering component architecture, state hooks, and virtual DOM rendering. |
| **TypeScript 5.8** | Programming Language | Type safety, strict interfaces for portfolio models, terminal commands, and layout settings. |
| **Vite 8.3.0** | Build Tool & Dev Server | Development server running on port 3000, fast HMR pipeline, and Rollup production bundling. |
| **Tailwind CSS 4.3.3** | Styling Framework | Utility-first styling imported via `@import "tailwindcss";` in `src/index.css` with zero inline CSS files. |
| **@tailwindcss/vite** | Vite Plugin | Native Vite integration for Tailwind CSS v4 compiler. |
| **GSAP 3.14.2** | Animation Engine | Staggered entrance animations, continuous portrait floating, 3D card tilt physics, and ScrollTrigger batching. |
| **Lucide React 0.546.0** | Icon System | Lightweight, accessible SVG icons for navigation, tech tags, and terminal interfaces. |
| **HTML5 Canvas API** | Graphics & Animation | Native zero-dependency particle constellation in `Hero.tsx` and digital rain sequence in `MatrixRainCanvas.tsx`. |
| **Express 4.21.2** | Backend Server | Server-side runtime proxy support for production Cloud Run hosting (`server.ts` integration). |
| **Dotenv 17.2.3** | Environment Config | Runtime environment variable resolution for server processes. |
| **Google Fonts** | Typography CDN | External web fonts: `Archivo Black` (display headlines), `Plus Jakarta Sans` (body prose), and `JetBrains Mono` (tabular telemetry). |

---

## 5. Project Showcase — All Seven Projects

### Project 1: Loan Approval Prediction

**Overview:** An underwriting risk evaluation engine that predicts loan applicant approval status using optimized Logistic Regression and XGBoost gradient-boosted ensembles. Incorporates automated feature engineering and SHAP (SHapley Additive exPlanations) to eliminate black-box opacity and provide transparent reasons for underwriting decisions.

**Key features:**
- Engineered Debt-to-Income and credit history weighting ratios that improved recall by 12.4%.
- Real-time TreeSHAP contribution waterfall visualizer auditing exact positive and negative feature factors per applicant.
- Handled class imbalance using SMOTE-NC without compromising false-positive safety thresholds.
- Built-in interactive simulator: adjust Credit Score (350–850), Annual Income, Loan Amount, and DTI to observe real-time approval status (`APPROVED`, `MANUAL REVIEW`, `DENIED`) and SHAP factor contributions.

**Tech stack:** Python, XGBoost, Scikit-learn, SHAP, Flask, Pandas.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/loan_approval_prediction)

---

### Project 2: Food Recognition & Calorie Estimation

**Overview:** A deep learning vision pipeline that classifies meal dishes from photographs and computes estimated calorie and macronutrient breakdown. Employs adaptive image enhancement, bounding contours, and custom CNN transfer learning.

**Key features:**
- Contrast-limited adaptive histogram equalization (CLAHE 2.0) preprocessing to neutralize restaurant lighting variations.
- Portion volume estimation heuristics derived from relative utensil and plate bounding contours.
- Generates complete macronutrient breakdowns (Protein, Carbs, Fats) cross-referenced with nutritional tables across 101 food classes.
- Built-in interactive simulator: select dishes (Salmon Bowl, Avocado Toast, Quinoa Salad, Pancakes) and adjust portion scale multipliers (0.5x–2.0x) to observe synthetic bounding boxes and real-time calorie updates.

**Tech stack:** Python, CNN, OpenCV, PyTorch, Transfer Learning, MobileNetV3.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/Food-Recognition-And-Calorie-Estimation)

---

### Project 3: Full-Stack Event Management Platform

**Overview:** A full-stack web application designed for organizing conferences and community events. Features authenticated user roles, Stripe checkout integration for tier passes, dynamic attendee management, and digital QR check-in badges.

**Key features:**
- Resilient webhook pipeline with Stripe for instantaneous, tamper-proof ticket issuance.
- Clerk authentication enforcing role-based access for conference organizers versus attendees.
- Dynamic digital badge generator rendering scannable QR ticket passes.
- Built-in interactive simulator: customize attendee names and toggle tiers (`Standard`, `VIP`, `Speaker`) to generate live digital conference passes with scannable QR codes.

**Tech stack:** React, Node.js, Flask, Clerk Auth, Stripe Checkout, Tailwind CSS.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/event-management)

---

### Project 4: Wildfire Hotspot Detection

**Overview:** An early-warning satellite classifier that analyzes multi-spectral thermal and optical imagery to detect active wildfire hotspots. Employs a DenseNet-121 backbone utilizing dense connectivity layers to preserve subtle thermal gradients and prevent false alarms from cloud reflectance.

**Key features:**
- DenseNet-121 feature reuse layers distinguishing active ground fires from ambient heat and solar reflections.
- Multi-spectral band processing combining Shortwave Infrared (SWIR) and Thermal Infrared (TIR) satellite data.
- Geospatial coordinate bounding with automated GeoJSON telemetry export for emergency GIS dispatchers.
- Built-in interactive simulator: toggle spectral bands (Optical RGB, Shortwave IR, Thermal IR) and adjust confidence sensitivity thresholds (50%–98%) to observe thermal anomaly overlays and coordinate bounding.

**Tech stack:** Python, DenseNet-121, CNN, PyTorch, Geospatial Raster Data, Flask.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/Wildfire_Detection)

---

### Project 5: Global Supply Chain Analytics

**Overview:** An enterprise analytics platform visualizing end-to-end international supply chain logistics. Predicts freight transit delays, optimizes buffer safety stock levels, and identifies vulnerabilities across global transport corridors.

**Key features:**
- Historical shipping telemetry correlation modeling weather disruptions and port congestion factors.
- Dynamic safety stock threshold calculator based on supplier lead-time variance.
- Interactive risk index tracking over 120 global trade corridors.
- Built-in interactive simulator: select trade corridors (Asia-Pacific Maritime, Trans-Atlantic Air Cargo, Eurasian Rail) and adjust disruption shock levels to compute arrival delay variances and safety buffer stock recommendations.

**Tech stack:** Python, Pandas, Predictive Modeling, Data Analytics, Plotly.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/Global_Supply_Chain_Analysis)

---

### Project 6: PDF RAG Intelligent Assistant

**Overview:** An enterprise document question-answering system powered by Llama 3.1 and dense vector embeddings. Allows users to query complex PDF documentation and receive accurate, grounded answers accompanied by exact page and paragraph citations.

**Key features:**
- Recursive table-aware document chunking to prevent semantic fragmentation across page boundaries.
- Hybrid retrieval combining dense vector cosine similarity with BM25 keyword matching.
- Verifiable citation indexing pointing to exact document page coordinates with strict hallucination guards.
- Built-in interactive simulator: enter custom queries or select preset legal/technical prompts to observe vector chunk retrieval scores and synthesized citations.

**Tech stack:** Python, Llama 3.1, BGE-Large Embeddings, Vector DB (FAISS/ChromaDB), LangChain, FastAPI.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/PDF-RAG-Chatbot)

---

### Project 7: Cognitive-Aware Conversational AI

**Overview:** A context-aware conversational agent that analyzes user cognitive signals—such as input latency, typing hesitation pauses, and sentiment polarity—to dynamically tune explanation depth, empathy, and response complexity.

**Key features:**
- Fine-tuned RoBERTa transformer classifying nuanced user affective states (frustration, uncertainty, confidence).
- Temporal keystroke pause analysis measuring cognitive hesitation before query submission.
- Dynamic prompt modulation providing step-by-step simplification when cognitive load or hesitation is flagged.
- Built-in interactive simulator: type custom text or select emotional presets to evaluate real-time sentiment polarity, measured pause latency, and adaptive empathetic response tuning.

**Tech stack:** Python, NLP, Hugging Face Transformers, RoBERTa, Sentiment Classification, FastAPI.

**Links:** [Live Interactive Simulator in App](#simulators) | [Source Code Repository](https://github.com/YogananthJ/Cognitive-Aware-AI-Chatbot)

---

## 6. Repository Structure

```text
/
├── .env.example                     # Environment variable blueprint (GEMINI_API_KEY, APP_URL)
├── .gitignore                       # Git exclusion rules (node_modules, dist, .env)
├── bun.lock                         # Lockfile for Bun package manager
├── index.html                       # HTML5 entry point with fonts, metadata, and favicon
├── metadata.json                    # AI Studio applet metadata & major capabilities
├── package.json                     # NPM dependency manifest & build scripts
├── tsconfig.json                    # TypeScript compiler configuration (ES2022, strict, bundler)
├── vite.config.ts                   # Vite configuration (React plugin, Tailwind v4 plugin, aliases)
├── public/
│   └── assets/
│       └── aistudio/
│           ├── favicon_507da8ac.png # High-res developer profile illustration & site favicon
│           └── Paste_October_23...  # Initial historical prototype reference
└── src/
    ├── main.tsx                     # Application DOM mount entry point
    ├── App.tsx                      # Root layout coordinator & keyboard shortcut manager
    ├── index.css                    # Tailwind CSS v4 entry, custom typography & paper grid styling
    ├── context/
    │   └── LayoutContext.tsx        # React Context managing layout mode, view mode, & density
    ├── types/
    │   ├── layout.ts                # TypeScript types for layout, view modes, and density
    │   ├── portfolio.ts             # TypeScript interfaces for projects, simulators, & skills
    │   └── terminal.ts              # TypeScript interfaces for terminal themes and history
    ├── data/
    │   ├── portfolioData.ts         # Verified project data, metrics, tech stacks, & bio
    │   └── terminalData.ts          # ASCII banners, Neofetch specs, manifesto, & 40+ commands
    ├── utils/
    │   └── gsapAnimations.ts        # GSAP timeline animations, 3D tilt, magnetic effect, & scroll triggers
    └── components/
        ├── Header.tsx               # 3-Zone top navigation bar with layout & terminal triggers
        ├── Hero.tsx                 # Monolithic display headline, avatar card, & particle canvas
        ├── LayoutController.tsx     # Floating workspace manager for split-screen & view toggles
        ├── WorkspaceSidebar.tsx     # Collapsible quick-jump directory for all 7 systems
        ├── SplitScreenWorkspace.tsx # Dual-pane developer workbench with resizable split ratios
        ├── ProjectShowcase.tsx      # Multi-format projects gallery (Grid, List, Bento views)
        ├── ProjectCard.tsx          # Project card with custom SVG vector telemetry graphics
        ├── ProjectSimulator.tsx     # Reusable interactive mathematical sandboxes for all 7 projects
        ├── ProjectModal.tsx         # Full-screen project architecture modal
        ├── SimulatorsSection.tsx    # Dedicated interactive lab section
        ├── SkillsSection.tsx        # Categorized competencies table with search filter
        ├── ExperienceSection.tsx    # Chronological experience and education timeline
        ├── ContactSection.tsx       # Functional contact composer with templates and email copying
        ├── Footer.tsx               # Brand lockup, IST clock, back-to-top button, & social links
        ├── TerminalDrawer.tsx       # 40+ command interactive developer CLI console
        └── MatrixRainCanvas.tsx     # HTML5 Canvas Matrix digital rain simulation
```

---

## 7. Installation & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **Package Manager:** `npm` (included with Node.js) or `bun`

### 1. Clone or Open the Repository
```bash
git clone https://github.com/YogananthJ/portfolio.git
cd portfolio
```

### 2. Install Dependencies
Install all required packages declared in `package.json`:
```bash
npm install
```

### 3. Start the Local Development Server
Launch Vite on port `3000`:
```bash
npm run dev
```
The application will be accessible locally at:
`http://localhost:3000`

### 4. Run TypeScript Verification & Linting
Validate type integrity and syntax:
```bash
npm run lint
```
*(This executes `tsc --noEmit` using the project's strict `tsconfig.json` rules).*

### 5. Build for Production
Generate the optimized production bundle in the `dist/` directory:
```bash
npm run build
```

### 6. Preview Production Build Locally
Serve the generated production assets:
```bash
npm run preview
```

---

## 8. Configuration & Environment Variables

### Environment Variables (`.env.example`)
The codebase includes an `.env.example` file specifying runtime variables:
```bash
# GEMINI_API_KEY: Required for optional server-side Gemini AI features.
# AI Studio automatically injects this at runtime from user secrets.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The hosting domain for self-referential links and OAuth callbacks.
APP_URL="MY_APP_URL"
```

*Note: The portfolio client runs entirely on static client-side logic without requiring third-party API keys to browse projects, test simulators, or run the terminal.*

### Contact Form Configuration
The contact section (`src/components/ContactSection.tsx`) is hardcoded to route messages directly to Yogananth's verified email address:
`mjyogananth@gmail.com`

When submitted, it compiles pre-validated subject lines and message bodies into an RFC-compliant `mailto:` handler while copying the message to the visitor's clipboard.

---

## 9. Design System & UI Architecture

### Color System (60-30-10 Ratio)
- **60% Dominant Neutral Canvas:** Archival warm paper (`#F5F2EB`) and secondary paper (`#EBE6DC`).
- **30% Structural Surfaces:** Stark deep ink (`#121212`), high-contrast hairline borders (`#121212/20`), and dark console surfaces (`#1C1C1E`).
- **10% High-Intent Accent:** Signal Crimson (`#E11D48` / `#F20D26`) used strictly for primary CTAs, active status indicators, and key metric highlights.

### Typography Hierarchy
```css
/* Display Headlines */
font-family: "Archivo Black", Impact, sans-serif;
letter-spacing: -0.02em;

/* Body Prose & Interfaces */
font-family: "Plus Jakarta Sans", system-ui, sans-serif;
line-height: 1.6;

/* Telemetry, Code, & Terminal */
font-family: "JetBrains Mono", monospace;
font-variant-numeric: tabular-nums;
```

### Tactile Paper Grid
Defined in `src/index.css`, subtle geometric grid patterns overlay the background:
```css
.paper-grid {
  background-image: 
    linear-gradient(to right, rgba(18, 18, 18, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(18, 18, 18, 0.05) 1px, transparent 1px);
  background-size: 28px 28px;
}
```

### Anti-Slop Discipline
- **Zero-Pill Enclosures:** Metadata (dates, categories, metrics) is styled as clean, unboxed text separated by typographic bullets (`·` or `/`).
- **No Broken Image Fallbacks:** When visual assets render, every project utilizes bespoke SVG vector charts and telemetry bars rather than broken external CDN links.
- **Single-Elevation Depth:** Clean solid drop shadows (`shadow-[4px_4px_0px_0px_#121212]`) rather than fuzzy multi-layer Gaussian blurs.

---

## 10. Interactive Developer Terminal Documentation

The application contains a developer CLI console (`src/components/TerminalDrawer.tsx`).

### How to Access
- **Keyboard Shortcut:** Press `⌘K` (macOS) or `Ctrl+K` (Windows/Linux) from anywhere on the site.
- **Top Bar:** Click the **`CLI [⌘K]`** button in the header.
- **Hero / Footer:** Click the **`CLI`** button in the Hero or navigation bar.

### Supported Commands Reference

#### Profile & Identity
| Command | Description |
|---|---|
| `whoami` | Displays developer identity, role, location, and professional summary. |
| `manifesto` | Reveals Yogananth's 4 core software engineering principles. |
| `timeline` | Displays chronological milestones from 2023 to 2026. |
| `currently` | Shows active technical learning, paper reading, and research experiments. |
| `funfact` | Generates a random verified developer fact. |

#### Projects & Engineering
| Command | Description |
|---|---|
| `projects` | Lists all 7 deployed machine learning and web applications. |
| `project <name>` | Deeply inspects a specific project (e.g. `project loan`, `project wildfire`). |
| `featured` | Displays the top 3 flagship engineering builds with quick triggers. |
| `architecture` | Renders an ASCII system architecture diagram of the XGBoost + SHAP pipeline. |
| `casestudy <name>` | Breaks down problem, technical architecture, and results for a project. |
| `github` | Opens Yogananth's GitHub profile and lists repository highlights. |
| `live` / `lab` | Displays quick interactive launchers for all mathematical simulators. |
| `changelog` | Outputs portfolio version history and recent feature additions. |

#### Skills & Knowledge
| Command | Description |
|---|---|
| `skills` | Outputs categorized technical skills with proficiency levels. |
| `stack` | Displays daily-driver core toolchain (Python, PyTorch, React, FastAPI). |
| `ml` | Deep-dive summary of machine learning and computer vision architectures used. |
| `webdev` | Summary of full-stack web capabilities, authentication, and payment workflows. |
| `toolbox` | Lists hardware, operating system, code editor, and developer tooling. |
| `learning` / `roadmap` | Outlines future technical learning goals for 2026. |

#### Interactive & Creative
| Command | Description |
|---|---|
| `help` | Displays complete command center reference directory. |
| `matrix` | Initiates an animated Matrix digital rain stream on canvas. |
| `neofetch` | Generates a Linux-style ASCII system identity report. |
| `quote` | Generates a random computer science quote (Dijkstra, Torvalds, Knuth, etc.). |
| `joke` | Tells a programming or machine learning joke. |
| `motd` | Prints the Message of the Day. |
| `fortune` | Reveals a developer fortune. |
| `theme <name>` | Toggles between 6 themes: `default`, `matrix`, `cyberpunk`, `dracula`, `amber`, `paper`. |
| `sudo hire` | Elevates terminal privileges to root and unlocks priority interview booking. |
| `secret` | Reveals developer easter eggs and secret hash. |
| `hack` | Runs a harmless diagnostic penetration test simulation. |
| `ping` | Simulates network roundtrip latency to the portfolio server. |
| `status` | Outputs memory heap, active session duration, and UI health telemetry. |

#### Career & Navigation
| Command | Description |
|---|---|
| `contact` | Displays verified email, LinkedIn, and GitHub links with copy actions. |
| `hire` | Outlines availability for 2026 graduation roles and core strengths. |
| `resume` | Generates direct links to request or inspect Yogananth's CV. |
| `linkedin` | Opens Yogananth's LinkedIn profile in a new browser tab. |
| `collaborate` | Guidelines for proposing open-source collaborations. |
| `availability` | Real-time employment availability status. |
| `services` | Summary of software engineering and ML modeling services offered. |
| `open <section>` | Smoothly scrolls to `#overview`, `#projects`, `#simulators`, `#skills`, `#experience`, or `#contact`. |
| `history` | Prints recent command history in the current session. |
| `date` | Displays current date and time in India Standard Time (IST). |
| `uptime` | Shows elapsed seconds since opening the terminal. |
| `clear` | Clears all previous log outputs from the terminal view. |
| `exit` | Closes the terminal drawer. |

### Adding a New Terminal Command
To add a command:
1. Open `src/data/terminalData.ts` and append your command string to `ALL_COMMAND_NAMES`.
2. Open `src/components/TerminalDrawer.tsx` and add a new `case '<command_name>':` inside `handleCommand()`.
3. Return a React JSX node containing your formatted output.

---

## 11. Contact & Social Links

| Platform | Destination | Recommended Use Case |
|---|---|---|
| **Primary Email** | [mjyogananth@gmail.com](mailto:mjyogananth@gmail.com) | Direct hiring inquiries, full-time engineering roles, and urgent communications. |
| **LinkedIn** | [linkedin.com/in/yogananth-j-653400307/](https://www.linkedin.com/in/yogananth-j-653400307/) | Professional networking, endorsements, and background verification. |
| **GitHub** | [github.com/YogananthJ](https://github.com/YogananthJ) | Inspecting source repositories, commit history, and code documentation. |

---

## 12. Deployment Guide

### Deployment Options

#### 1. Production Build (Static Hosting on Cloud Run / Vercel / Netlify)
This project compiles into static HTML, JavaScript, and CSS:
```bash
npm run build
```
The output directory is `dist/`.

#### 2. Google Cloud Run (Current Container Environment)
- Build command: `npm run build`
- Port constraint: Server binds to port `3000` via `0.0.0.0`.
- Development script: `vite --port=3000 --host=0.0.0.0`
- Production start: `node server.js` or static file hosting from `dist/`.

### Post-Deployment Verification Checklist
- [ ] Verify that Google Fonts (`Archivo Black`, `Plus Jakarta Sans`, `JetBrains Mono`) load without FOIT.
- [ ] Test that `⌘K` opens the TerminalDrawer on both desktop and mobile viewports.
- [ ] Test each of the 7 simulators in `src/components/ProjectSimulator.tsx`.
- [ ] Verify that all 7 GitHub repository links open the correct URLs.
- [ ] Test the contact form submission handler.
- [ ] Verify that the favicon (`/assets/aistudio/favicon_507da8ac.png`) renders in browser tabs.

---

## 13. Performance, Accessibility & Troubleshooting

### Verified Optimizations
- **Composite-Only Animations:** GSAP animations strictly mutate `transform` and `opacity`, avoiding layout thrashing.
- **Hardware-Accelerated Canvas:** Both `Hero.tsx` and `MatrixRainCanvas.tsx` utilize `requestAnimationFrame()` loops with automatic event listener cleanup to prevent memory leaks.
- **Zero Heavy Image Bloat:** Project previews are rendered via lightweight SVG vector graphics.
- **Reduced Motion Compliance:** `gsapAnimations.ts` explicitly checks `window.matchMedia('(prefers-reduced-motion: reduce)')` to disable heavy animations for users with motion sensitivity.
- **Semantic HTML:** Form elements include explicit `<label>` tags, and modals implement `role="dialog"`, `aria-modal="true"`, and `Escape` key listeners.

### Troubleshooting Guide

| Issue | Root Cause | Solution |
|---|---|---|
| **Port 3000 already in use** | A previous dev server process is running. | Kill process: `lsof -ti:3000 \| xargs kill -9` or pass `--port=3001` to Vite. |
| **Terminal autocomplete not firing** | Cursor focus lost from input field. | Click inside the terminal input bar or press `Tab` after typing at least 1 character. |
| **Canvas animation appears frozen** | Window tab inactive or reduced motion active. | Check your OS motion preferences; canvas resumes automatically when the tab regains focus. |
| **Fonts look like default Arial** | Network blocking Google Fonts CDN. | Ensure network allows `fonts.googleapis.com` and `fonts.gstatic.com`. |

---

## 14. Development & Contribution Guidelines

### Where to Make Edits
- **Update Biography, Skills, or Projects:** Edit `src/data/portfolioData.ts`.
- **Add or Edit Terminal Commands:** Edit `src/data/terminalData.ts` and `src/components/TerminalDrawer.tsx`.
- **Modify Theme Colors or Layout Tokens:** Edit `src/index.css`.
- **Adjust GSAP Animation Timings:** Edit `src/utils/gsapAnimations.ts`.
- **Add a New Project Simulator:** Edit `src/components/ProjectSimulator.tsx`.

### Suggested Git Workflow
```bash
# 1. Create a feature branch
git checkout -b feature/new-project-simulator

# 2. Make code edits and verify types
npm run lint

# 3. Test production build
npm run build

# 4. Commit changes
git commit -m "feat: add real-time simulator for project X"
```

---

## 15. Roadmap & Future Improvements

### Implemented
- [x] Dual-Pane Split-Screen developer workbench with adjustable split ratios (40/60, 50/50, 60/40).
- [x] Seven client-side interactive mathematical project simulators with real-time parameter tuning.
- [x] Multi-view project showcase (Grid, Compact Table Ledger, and Asymmetric Bento views).
- [x] Interactive Developer Command Center terminal with 40+ commands, autocomplete, history, and themes.
- [x] Authentic Matrix digital rain animation canvas.
- [x] Editorial neo-brutalist design system with paper grid textures and zero broken images.
- [x] High-resolution developer character portrait integration across Hero and favicon.

### In Progress
- [ ] WebGPU in-browser inference for local token generation directly inside the terminal.
- [ ] Exportable PDF project case studies generated dynamically from simulator outputs.

### Planned
- [ ] Live WebSocket telemetry stream for actual server latency and memory profiling.
- [ ] Interactive 3D model visualizer for geospatial wildfire hotspot terrain.

---

## 16. License & Credits

### Repository License
*Note: No formal open-source license file (`LICENSE`) was found in the initial repository.*
If you intend to make this repository publicly forkable, the **MIT License** is recommended for the code structure, while preserving personal ownership over identity, bio, and avatar assets.

### Third-Party Credits & Attributions
- **Iconography:** Lucide Icons ([ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE))
- **Animation Engine:** GreenSock GSAP ([Standard License](https://greensock.com/licensing/))
- **Typography:**
  - *Archivo Black* by Omnibus-Type ([SIL Open Font License](https://scripts.sil.org/OFL))
  - *Plus Jakarta Sans* by Tokotype ([SIL Open Font License](https://scripts.sil.org/OFL))
  - *JetBrains Mono* by JetBrains ([SIL Open Font License](https://scripts.sil.org/OFL))
- **UI Frameworks:** React 19, Vite, and Tailwind CSS v4.

---

*Authored by **Yogananth J** · AI & Full-Stack Engineer · 2026*
