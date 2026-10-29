import { AcademicBranch, CodingLevel, Milestone, ProjectBlueprint, ProjectInterest } from '../types/index';

interface BlueprintTemplate {
  title: string;
  desc: string;
  detailedDesc: string;
  portfolioImpact: string;
  milestoneThemes: {
    m1Title: string;
    m1Desc: string;
    m2Title: string;
    m2Desc: string;
    m3Title: string;
    m3Desc: string;
  };
}

// Branch-specific domain knowledge matrix for each Project Interest
const DOMAIN_MATRIX: Record<AcademicBranch, Record<ProjectInterest, BlueprintTemplate>> = {
  CSE: {
    'Chatbot': {
      title: 'Full-Stack Developer Docs & Campus FAQ Copilot',
      desc: 'An AI assistant that indexes campus circulars, syllabi, and technical documentation with intelligent question-answering and source citations.',
      detailedDesc: 'Build a retrieval-powered developer and campus assistant that indexes university notices, syllabus circulars, and developer documentation into an interactive query interface.',
      portfolioImpact: 'Demonstrates end-to-end full-stack AI integration, conversational prompt engineering, and real-time knowledge retrieval critical for modern software engineering roles.',
      milestoneThemes: {
        m1Title: 'API Authentication & Scaffolding',
        m1Desc: 'Initialize the project workspace, configure Gemini API keys, and build structured system prompts for campus and code queries.',
        m2Title: 'Context Extraction & Query Logic',
        m2Desc: 'Parse documents, extract key intent tokens, and connect prompt context with accurate source citations.',
        m3Title: 'Interactive Web UI & Deployment',
        m3Desc: 'Construct a responsive web interface, test edge-case prompts, and publish a live cloud URL for peer demonstrations.',
      },
    },
    'Resume & Career Tools': {
      title: 'Smart ATS Resume Analyzer & Interview Copilot',
      desc: 'An AI-powered web app that extracts resume bullet points, matches skills against job specs, and suggests tailored technical interview answers.',
      detailedDesc: 'Build a working full-stack AI tool that ingests student resumes, evaluates keyword density against real job descriptions, and auto-generates customized interview behavioral questions.',
      portfolioImpact: 'Highlights practical LLM integration, prompt engineering, and real-world utility that stands out in fresher campus placements and software engineering internships.',
      milestoneThemes: {
        m1Title: 'Environment & Parser Scaffolding',
        m1Desc: 'Set up Python environment, configure Gemini LLM authentication, and structure secure HR evaluation system prompts.',
        m2Title: 'Resume Parsing & Keyword Matching',
        m2Desc: 'Extract raw text from PDF uploads, compute semantic similarity against tech job specs, and flag missing competencies.',
        m3Title: 'Applicant Portal & Live Cloud Launch',
        m3Desc: 'Bind the frontend form, test resume uploads, generate tailored interview answers, and deploy to a public URL.',
      },
    },
    'Study Assistant': {
      title: 'DSA Code Explainer & Interactive Flashcards',
      desc: 'A student productivity tool that turns dry textbook code and algorithms into step-by-step visual explanations and spaced-repetition quizzes.',
      detailedDesc: 'Transform complex DSA concepts and dry textbook algorithms into step-by-step interactive explanations, conceptual breakdowns, and adaptive self-quizzes.',
      portfolioImpact: 'Demonstrates ability to break down complex computer science algorithms using AI-driven pedagogical tooling with clean user experience.',
      milestoneThemes: {
        m1Title: 'Code Syntax Ingestion & Tokenizer',
        m1Desc: 'Accept code or algorithm snippets, detect syntax constructs, complexity bottlenecks, and data flow.',
        m2Title: 'Multi-Level Explanation Engine',
        m2Desc: 'Run targeted prompting for multi-level difficulty summaries (Beginner ELI5, Interview Ready, and Edge Cases).',
        m3Title: 'Spaced-Repetition Quiz & Web Portal',
        m3Desc: 'Generate downloadable flashcard decks with interactive self-quizzing and one-click cloud export.',
      },
    },
    'Data Dashboard': {
      title: 'Tech Hiring Demand & Placement Intelligence Portal',
      desc: 'An automated dashboard analyzing engineering hiring trends, required skill tags, and tier-1 company compensation benchmarks.',
      detailedDesc: 'An automated intelligence dashboard that scours tech recruitment trends, maps required frameworks against campus curriculum, and recommends high-yield project ideas.',
      portfolioImpact: 'Demonstrates end-to-end data analytics and business intelligence mastery with executive visual presentation.',
      milestoneThemes: {
        m1Title: 'Hiring Data Cleanse & Normalization',
        m1Desc: 'Clean placement salary trends and job postings into structured DataFrames with key industry tags.',
        m2Title: 'AI Trend Clustering & Skill Matching',
        m2Desc: 'Use Gemini to cluster emerging tech stacks and highlight high-paying niche skills for freshers.',
        m3Title: 'Interactive Visual Analytics Portal',
        m3Desc: 'Render interactive heatmaps, salary distributions, and downloadable interview prep roadmaps.',
      },
    },
  },
  IT: {
    'Chatbot': {
      title: 'Cloud Infrastructure & Campus IT Helpdesk Copilot',
      desc: 'An intelligent IT service desk assistant that resolves Wi-Fi, lab server, and cloud provisioning tickets using automated runbook matching.',
      detailedDesc: 'Build an automated IT support assistant that matches student ticket descriptions against university IT runbooks, network configurations, and troubleshooting guides.',
      portfolioImpact: 'Demonstrates practical cloud support automation, IT ticket triaging, and prompt workflows relevant for IT operations and cloud engineer placements.',
      milestoneThemes: {
        m1Title: 'IT Runbook & Knowledge Scaffolding',
        m1Desc: 'Initialize IT support knowledge bases, configure API access, and structure IT triage system prompts.',
        m2Title: 'Ticket Intent Classification & Triaging',
        m2Desc: 'Categorize incoming support issues into network, hardware, or access problems and retrieve exact resolution steps.',
        m3Title: 'Self-Service IT Helpdesk Portal',
        m3Desc: 'Assemble a self-service ticket resolution portal with step-by-step verified troubleshooting guides.',
      },
    },
    'Resume & Career Tools': {
      title: 'IT Systems & Cloud Engineer Resume Evaluator',
      desc: 'An automated resume screener analyzing cloud certifications, DevOps tools, and enterprise IT support experience against job criteria.',
      detailedDesc: 'Ingest student resumes, evaluate proficiency in Linux, cloud platforms (AWS/Azure), and ITIL workflows, and generate targeted interview questions.',
      portfolioImpact: 'Proves domain awareness in cloud infrastructure, enterprise IT service management, and recruiter screening criteria.',
      milestoneThemes: {
        m1Title: 'Resume & Cloud Skill Taxonomy Setup',
        m1Desc: 'Configure extraction schemas for AWS/Azure certifications, Linux administration, and network security competencies.',
        m2Title: 'Competency Gap & Keyword Scoring',
        m2Desc: 'Compare candidate resume metrics against industry DevOps and Cloud Sysadmin role requirements.',
        m3Title: 'Candidate Profile Generator & Deploy',
        m3Desc: 'Build an interactive candidate scoring view with personalized interview readiness recommendations.',
      },
    },
    'Study Assistant': {
      title: 'Networking & Cloud Computing Concepts Audio Explainer',
      desc: 'An interactive study assistant breaking down OSI layers, TCP/IP handshakes, and cloud architecture patterns with audio recaps.',
      detailedDesc: 'Turn complex networking protocols and cloud architectural concepts into conversational explanations and rapid-fire revision cards.',
      portfolioImpact: 'Demonstrates deep conceptual understanding of networking and cloud fundamentals combined with generative audio-text workflows.',
      milestoneThemes: {
        m1Title: 'Protocol Ingestion & Concept Parser',
        m1Desc: 'Structure networking protocols, packet flow summaries, and cloud terminology into clean prompts.',
        m2Title: 'Adaptive Explanations & Diagram Prompts',
        m2Desc: 'Generate tailored analogy-based explanations for tricky protocols (DNS, TLS, BGP, Subnetting).',
        m3Title: 'Interactive Audio Revision Player',
        m3Desc: 'Bind voice synthesis to concept summaries for rapid audio review before lab exams.',
      },
    },
    'Data Dashboard': {
      title: 'Campus IT Network & Server Uptime Monitor',
      desc: 'A visual telemetry dashboard analyzing campus server latency, network throughput logs, and bandwidth utilization trends.',
      detailedDesc: 'Clean campus server logs and bandwidth telemetry to identify bottleneck periods and generate AI-driven capacity recommendations.',
      portfolioImpact: 'Demonstrates IT infrastructure analytics, log parsing, and operational dashboard engineering skills prized in DevOps teams.',
      milestoneThemes: {
        m1Title: 'Server Log Ingestion & Formatting',
        m1Desc: 'Process raw network traffic logs and ping timestamps into structured time-series tables.',
        m2Title: 'AI Anomaly Detection & Insights',
        m2Desc: 'Use Gemini to detect traffic spikes, packet drop anomalies, and propose bandwidth redistribution.',
        m3Title: 'Live Network Ops Dashboard',
        m3Desc: 'Render interactive bandwidth charts, uptime gauges, and downloadable server health reports.',
      },
    },
  },
  AIML: {
    'Chatbot': {
      title: 'Multi-Document Research & Model Architecture RAG Copilot',
      desc: 'A cutting-edge research copilot that parses arXiv AI research papers and synthesizes comparative model architectures with citations.',
      detailedDesc: 'Build a sophisticated Retrieval-Augmented Generation assistant that indexes deep learning papers and provides comparative architectural analysis.',
      portfolioImpact: 'Directly showcases state-of-the-art RAG architecture, vector search, and model benchmarking—the #1 topic in AI/ML technical interviews.',
      milestoneThemes: {
        m1Title: 'Research Ingestion & Vector Indexing',
        m1Desc: 'Set up embeddings, chunk machine learning papers into semantic sections, and build a vector similarity store.',
        m2Title: 'RAG Retrieval Pipeline & Grounding',
        m2Desc: 'Connect contextual vector search into Gemini prompts with strict hallucination guards and paper citations.',
        m3Title: 'Research Assistant Console & Deploy',
        m3Desc: 'Launch a responsive chat workspace with pre-configured prompts for hyperparameter tuning and model comparisons.',
      },
    },
    'Resume & Career Tools': {
      title: 'Data Science & MLOps Portfolio Evaluator with Benchmark Scoring',
      desc: 'An AI tool that audits Kaggle profiles, GitHub repos, and model evaluation metrics on resumes for AI engineer placements.',
      detailedDesc: 'Analyze student ML project descriptions, verify claims regarding validation scores, ROC-AUC metrics, and model serving experience.',
      portfolioImpact: 'Highlights specialized domain knowledge in ML validation metrics, model productionalization, and recruiter screening expectations.',
      milestoneThemes: {
        m1Title: 'ML Competency Taxonomy Setup',
        m1Desc: 'Configure schemas for deep learning frameworks (PyTorch, Hugging Face), model evaluation metrics, and MLOps tools.',
        m2Title: 'Project Rigor & Metric Evaluation',
        m2Desc: 'Evaluate resume project descriptions for realistic metric claims, data leakage warnings, and architecture justification.',
        m3Title: 'ML Portfolio Scorecard & Cloud Launch',
        m3Desc: 'Generate candidate scorecard with recommended portfolio improvements and mock interview technical questions.',
      },
    },
    'Study Assistant': {
      title: 'Neural Architecture & Loss Function Interactive Visual Tutor',
      desc: 'An intuitive study companion that explains backpropagation, transformer attention math, and loss functions with visual breakdowns.',
      detailedDesc: 'Break down complex linear algebra and calculus concepts behind modern deep neural networks into step-by-step visual proofs and quizzes.',
      portfolioImpact: 'Demonstrates deep mastery of theoretical ML concepts and generative AI pedagogy.',
      milestoneThemes: {
        m1Title: 'Mathematical Formula & Concept Ingestion',
        m1Desc: 'Structure loss equations, gradient descent steps, and attention matrix calculations into clean prompt contexts.',
        m2Title: 'Step-by-Step Proof & Intuition Generator',
        m2Desc: 'Prompt Gemini to generate intuitive geometric analogies, edge case warnings, and common student pitfalls.',
        m3Title: 'Interactive Concept Lab & Flashcards',
        m3Desc: 'Deploy a visual web interface with interactive sliders, math step-throughs, and review quizzes.',
      },
    },
    'Data Dashboard': {
      title: 'LLM Token Economics, Latency & Benchmark Intelligence Portal',
      desc: 'An automated dashboard tracking inference cost per million tokens, response latency, and benchmark performance across open LLM models.',
      detailedDesc: 'Benchmark top LLM providers (Gemini, Groq, Claude) across latency, context window limits, and cost metrics to guide engineering decisions.',
      portfolioImpact: 'Demonstrates practical LLM evaluation, cost optimization, and benchmarking skills critical for enterprise AI adoption.',
      milestoneThemes: {
        m1Title: 'Model Benchmark Telemetry Ingestion',
        m1Desc: 'Aggregate token pricing, TTFT (time-to-first-token), and throughput benchmarks into structured records.',
        m2Title: 'Cost-Performance Pareto Frontier Engine',
        m2Desc: 'Compute Pareto-optimal model selections based on task complexity, latency constraints, and budgetary limits.',
        m3Title: 'Interactive LLM Benchmark Dashboard',
        m3Desc: 'Visualize latency vs cost scatter plots, trade-off sliders, and automated architectural recommendations.',
      },
    },
  },
  ECE: {
    'Chatbot': {
      title: 'Embedded Systems & IoT Hardware Diagnostic Copilot',
      desc: 'An AI copilot that analyzes microcontroller pinouts, I2C/SPI bus error codes, and sensor datasheets to accelerate hardware debugging.',
      detailedDesc: 'Build an AI assistant that ingests microcontroller datasheets (ESP32, Arduino, STM32) and translates cryptic register flags into hardware fixes.',
      portfolioImpact: 'Shows unique cross-disciplinary expertise combining generative AI with embedded systems and IoT hardware troubleshooting.',
      milestoneThemes: {
        m1Title: 'Hardware Datasheet & Pinout Scaffolding',
        m1Desc: 'Ingest microcontroller pinout diagrams, register definitions, and peripheral protocols into structured prompt templates.',
        m2Title: 'Hardware Fault Code & Bus Diagnostics',
        m2Desc: 'Map sensor error logs (I2C timeouts, brownouts, baud rate mismatches) to targeted schematic checks.',
        m3Title: 'Lab Bench Troubleshooting Web Console',
        m3Desc: 'Deploy an engineer-friendly lab bench web interface for quick reference during lab sessions and hardware builds.',
      },
    },
    'Resume & Career Tools': {
      title: 'Core Electronics & VLSI Hardware Engineering Resume Optimizer',
      desc: 'An ATS resume evaluator specifically tuned for core ECE domains including FPGA, Verilog, embedded C, and PCB design careers.',
      detailedDesc: 'Evaluate student resumes against top semiconductor and hardware company criteria (TI, Qualcomm, Intel), checking for Verilog and lab equipment experience.',
      portfolioImpact: 'Addresses the core engineering gap by tailoring resume presentation to semiconductor, VLSI, and embedded firmware recruiters.',
      milestoneThemes: {
        m1Title: 'Hardware Engineering Taxonomy Setup',
        m1Desc: 'Configure domain dictionaries for EDA tools, Verilog/VHDL, oscilloscope measurements, and microcontroller families.',
        m2Title: 'Core Skill Verification & Gap Analysis',
        m2Desc: 'Score candidate resume depth against semiconductor job specs and suggest high-value hardware portfolio projects.',
        m3Title: 'Core Engineering Interview Prep Portal',
        m3Desc: 'Launch a tailored web application providing hardware design problem prompts and resume improvement tips.',
      },
    },
    'Study Assistant': {
      title: 'Digital Electronics & Circuit Theory Audio Flashcards',
      desc: 'An audio-enabled study assistant explaining Karnaugh maps, state machines, and circuit theorems with interactive quick-checks.',
      detailedDesc: 'Transform difficult analog and digital circuit concepts into step-by-step problem roadmaps and audio revision notes for lab exams.',
      portfolioImpact: 'Demonstrates innovative use of generative audio for engineering education, making complex hardware theory accessible.',
      milestoneThemes: {
        m1Title: 'Circuit Schema & Theorem Ingestion',
        m1Desc: 'Ingest circuit theorems (Thevenin, Norton, Superposition) and logic minimization rules into clear structured prompts.',
        m2Title: 'Step-by-Step Solver & Troubleshooting Logic',
        m2Desc: 'Generate step-by-step solution guides for network equations and highlight common sign convention errors.',
        m3Title: 'Audio Revision Player & Flashcard Deck',
        m3Desc: 'Build an interactive web player with audio summaries for rapid recall of circuit formulas before practical tests.',
      },
    },
    'Data Dashboard': {
      title: 'Arduino & Sensor Telemetry Visualizer Dashboard',
      desc: 'A real-time telemetry dashboard analyzing temperature, accelerometer, and voltage sensor streams with AI anomaly detection.',
      detailedDesc: 'Process continuous IoT sensor streams from hardware development boards and detect out-of-spec voltage spikes using automated heuristics.',
      portfolioImpact: 'Proves capability in IoT telemetry streaming, sensor data visualization, and automated edge signal anomaly detection.',
      milestoneThemes: {
        m1Title: 'Sensor Stream Ingestion & Parsing',
        m1Desc: 'Parse serial/MQTT data streams from microcontrollers into time-indexed arrays with noise filtering.',
        m2Title: 'Signal Drift & Anomaly Detection',
        m2Desc: 'Run Gemini-powered trend analysis to identify sensor calibration drift and abnormal thermal surges.',
        m3Title: 'Interactive Hardware Telemetry Portal',
        m3Desc: 'Render real-time sensor gauges, oscilloscope-style wave plots, and downloadable CSV telemetry logs.',
      },
    },
  },
  OTHER: {
    'Chatbot': {
      title: 'Engineering Lab Manual & Workshop SOP Assistant',
      desc: 'An AI assistant for mechanical, civil, and chemical engineering labs that answers safety SOP and equipment calibration questions.',
      detailedDesc: 'Build an automated laboratory assistant that indexes industrial safety standards, equipment operating manuals, and test protocols.',
      portfolioImpact: 'Demonstrates practical enterprise safety automation and knowledge indexing for core engineering and manufacturing operations.',
      milestoneThemes: {
        m1Title: 'Lab SOP & Safety Standard Setup',
        m1Desc: 'Configure laboratory manual guidelines, material safety data sheets (MSDS), and equipment checklists.',
        m2Title: 'Operational Query Answering & Verification',
        m2Desc: 'Connect natural language equipment queries with exact calibration tolerances and PPE safety requirements.',
        m3Title: 'Interactive Workshop Assistant Portal',
        m3Desc: 'Publish an accessible mobile-friendly web app for students and lab technicians to reference during practicals.',
      },
    },
    'Resume & Career Tools': {
      title: 'Core Engineering Campus Placement Resume Optimizer',
      desc: 'An ATS resume scanner tailored for mechanical, civil, and multidisciplinary engineering students targeting top core industries.',
      detailedDesc: 'Match CAD/CAM projects, site management internships, and lab research against recruitment criteria at top core engineering firms.',
      portfolioImpact: 'Demonstrates practical understanding of core engineering recruitment criteria, project metrics, and technical skill validation.',
      milestoneThemes: {
        m1Title: 'Core Industry Competency Setup',
        m1Desc: 'Define skill dictionaries for AutoCAD, SolidWorks, FEA, site surveying, and quality control methodologies.',
        m2Title: 'Project Impact & Metric Evaluation',
        m2Desc: 'Audit project descriptions to ensure tangible mechanical/civil outcomes, tolerances, and design constraints are highlighted.',
        m3Title: 'Placement Strategy Dashboard & Deploy',
        m3Desc: 'Generate a comprehensive resume report with tailored interview prep questions for core engineering walk-in drives.',
      },
    },
    'Study Assistant': {
      title: 'Engineering Mechanics & Thermodynamics Audio Explainer',
      desc: 'A concept study companion that simplifies heat transfer equations, stress-strain curves, and fluid dynamics with audio summaries.',
      detailedDesc: 'Break down tough physical engineering concepts and boundary condition equations into intuitive visual explanations and audio notes.',
      portfolioImpact: 'Showcases cross-disciplinary generative AI applications that bridge physical engineering theory with digital learning.',
      milestoneThemes: {
        m1Title: 'Physics Formula & Boundary Setup',
        m1Desc: 'Structure thermodynamic cycles (Carnot, Rankine) and structural equilibrium formulas into clear prompt contexts.',
        m2Title: 'Physical Intuition & Problem Roadmap',
        m2Desc: 'Generate step-by-step problem roadmaps with physical intuition checks to prevent common calculation mistakes.',
        m3Title: 'Audio Flashcards & Revision Portal',
        m3Desc: 'Launch an interactive web dashboard with voice recaps of key formulas and automated practice quizzes.',
      },
    },
    'Data Dashboard': {
      title: 'Industrial Equipment Sensor & Stress Analytics Portal',
      desc: 'A visual analytics dashboard monitoring material stress curves, manufacturing cycle times, and equipment vibration logs.',
      detailedDesc: 'Ingest mechanical test bench logs or civil structural sensor data to identify fatigue points and predictive maintenance schedules.',
      portfolioImpact: 'Demonstrates high-demand industrial data analytics, predictive maintenance modeling, and executive dashboard design.',
      milestoneThemes: {
        m1Title: 'Test Bench Data Cleanse & Parsing',
        m1Desc: 'Process raw strain gauge logs and machine vibration cycles into structured data tables.',
        m2Title: 'Material Fatigue & Anomaly Analysis',
        m2Desc: 'Use Gemini to detect abnormal harmonic vibrations and estimate remaining useful life (RUL) thresholds.',
        m3Title: 'Executive Industrial Analytics Portal',
        m3Desc: 'Render interactive stress-strain diagrams, equipment health heatmaps, and downloadable inspection summaries.',
      },
    },
  },
};

// Deterministic complexity configuration driven by Coding Level
interface CodingLevelConfig {
  difficulty: 'Beginner' | 'Intermediate' | 'All Levels';
  feasibility: string;
  prefix: string;
  techStack: string[];
  milestoneModifier: (mNum: number, title: string, desc: string) => { title: string; desc: string };
}

const CODING_LEVEL_CONFIGS: Record<CodingLevel, CodingLevelConfig> = {
  Beginner: {
    difficulty: 'Beginner',
    feasibility: '98%',
    prefix: 'Starter',
    techStack: ['Python 3.11', 'Google Gemini 1.5 Flash', 'Streamlit Cloud UI', 'Pandas & PyPDF2'],
    milestoneModifier: (mNum: number, title: string, desc: string) => {
      if (mNum === 1) {
        return {
          title: `Scaffolded Setup: ${title}`,
          desc: `Beginner-friendly zero-install template: ${desc} Pre-configured code skeletons avoid low-level boilerplate.`,
        };
      }
      if (mNum === 2) {
        return {
          title: `Guided Implementation: ${title}`,
          desc: `Step-by-step prompt flow: ${desc} Uses high-level Gemini SDK functions without complex memory management.`,
        };
      }
      return {
        title: `1-Click Streamlit UI: ${title}`,
        desc: `Rapid frontend launch: ${desc} Ready-made UI components allow instant live testing and sharing with classmates.`,
      };
    },
  },
  Basic: {
    difficulty: 'All Levels',
    feasibility: '95%',
    prefix: 'Custom',
    techStack: [
      'Python 3.11',
      'Google Gemini 1.5 Flash',
      'Pydantic Data Schemas',
      'Streamlit Cloud',
      'In-Memory Cache / JSON',
    ],
    milestoneModifier: (mNum: number, title: string, desc: string) => {
      if (mNum === 1) {
        return {
          title: `Structured Schema Setup: ${title}`,
          desc: `Define typed schemas: ${desc} Enforce Pydantic validation on incoming student inputs and prompt templates.`,
        };
      }
      if (mNum === 2) {
        return {
          title: `Prompt Chaining & Logic: ${title}`,
          desc: `Custom validation pipeline: ${desc} Connect multi-turn reasoning and structured JSON output parsers.`,
        };
      }
      return {
        title: `Interactive Web Portal: ${title}`,
        desc: `Complete interface with error states: ${desc} Implement user input safeguards and publish a live cloud URL.`,
      };
    },
  },
  Intermediate: {
    difficulty: 'Intermediate',
    feasibility: '92%',
    prefix: 'Advanced',
    techStack: [
      'Python 3.11',
      'Google Gemini 1.5 Flash',
      'FAISS Vector Store',
      'LangChain RAG Pipeline',
      'Async Engine & Latency Profiler',
    ],
    milestoneModifier: (mNum: number, title: string, desc: string) => {
      if (mNum === 1) {
        return {
          title: `Vector Indexing & Architecture: ${title}`,
          desc: `Vector store scaffolding: ${desc} Implement semantic chunking, embedding generation, and FAISS index persistence.`,
        };
      }
      if (mNum === 2) {
        return {
          title: `Contextual RAG & Evaluation: ${title}`,
          desc: `Multi-hop retrieval logic: ${desc} Implement semantic reranking, citation grounding, and latency profiling.`,
        };
      }
      return {
        title: `Async Engine & Cloud Deploy: ${title}`,
        desc: `High-concurrency cloud portal: ${desc} Connect streaming tokens, token cost telemetry, and deploy to production cloud.`,
      };
    },
  },
};

/**
 * Deterministic recommendation engine that adapts to ALL THREE inputs:
 * 1. Branch: Sets the technical domain and use case (CSE, IT, AIML, ECE, OTHER)
 * 2. Interest: Determines the core project category (Chatbot, Resume, Study Assistant, Dashboard)
 * 3. Coding Level: Determines complexity, tech stack, difficulty, and milestone implementation depth
 */
export function getRecommendedBlueprint(
  branch: AcademicBranch,
  interest: ProjectInterest,
  codingLevel: string
): ProjectBlueprint {
  // Normalize inputs with safe fallbacks
  const safeBranch: AcademicBranch = DOMAIN_MATRIX[branch] ? branch : 'CSE';
  const safeInterest: ProjectInterest = DOMAIN_MATRIX[safeBranch][interest] ? interest : 'Resume & Career Tools';
  const safeLevel: CodingLevel = (
    codingLevel === 'Intermediate' ? 'Intermediate' : codingLevel === 'Basic' ? 'Basic' : 'Beginner'
  ) as CodingLevel;

  const domain = DOMAIN_MATRIX[safeBranch][safeInterest];
  const levelConfig = CODING_LEVEL_CONFIGS[safeLevel];

  // Construct deterministic unique project ID
  const interestSlug = safeInterest.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const branchSlug = safeBranch.toLowerCase();
  const levelSlug = safeLevel.toLowerCase();
  const id = `${interestSlug}-${branchSlug}-${levelSlug}`;

  // Formulate tailored milestones adapting to branch domain + coding complexity
  const rawMilestones = [
    {
      mNum: 1,
      timeframe: '00–20 Mins',
      title: domain.milestoneThemes.m1Title,
      desc: domain.milestoneThemes.m1Desc,
    },
    {
      mNum: 2,
      timeframe: '20–45 Mins',
      title: domain.milestoneThemes.m2Title,
      desc: domain.milestoneThemes.m2Desc,
    },
    {
      mNum: 3,
      timeframe: '45–60 Mins',
      title: domain.milestoneThemes.m3Title,
      desc: domain.milestoneThemes.m3Desc,
    },
  ];

  const milestones: Milestone[] = rawMilestones.map((m) => {
    const modified = levelConfig.milestoneModifier(m.mNum, m.title, m.desc);
    return {
      timeframe: m.timeframe,
      milestoneNumber: m.mNum,
      title: modified.title,
      desc: modified.desc,
    };
  });

  // Adjust title based on coding level to reflect depth accurately
  let displayTitle = domain.title;
  if (safeLevel === 'Intermediate' && !displayTitle.includes('RAG') && !displayTitle.includes('Advanced')) {
    displayTitle = `${displayTitle} (RAG & Vector Pipeline)`;
  } else if (safeLevel === 'Beginner' && !displayTitle.includes('Quickstart')) {
    displayTitle = `${displayTitle} (Fast-Track)`;
  }

  const category = `Matched Blueprint • ${safeBranch} Track • ${safeLevel} Level`;

  return {
    id,
    interest: safeInterest,
    title: displayTitle,
    category,
    feasibility: levelConfig.feasibility,
    desc: domain.desc,
    detailedDesc: domain.detailedDesc,
    targetBranches: [safeBranch],
    difficulty: levelConfig.difficulty,
    techStack: levelConfig.techStack,
    milestones,
    portfolioImpact: domain.portfolioImpact,
  };
}

// Fallback legacy constant for backwards compatibility if needed
export const BLUEPRINTS: Record<ProjectInterest, ProjectBlueprint> = {
  'Resume & Career Tools': getRecommendedBlueprint('CSE', 'Resume & Career Tools', 'Beginner'),
  'Chatbot': getRecommendedBlueprint('CSE', 'Chatbot', 'Beginner'),
  'Study Assistant': getRecommendedBlueprint('CSE', 'Study Assistant', 'Beginner'),
  'Data Dashboard': getRecommendedBlueprint('CSE', 'Data Dashboard', 'Beginner'),
};
