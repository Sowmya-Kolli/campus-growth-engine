import { AcademicBranch, ProjectBlueprint, ProjectInterest } from '@/types';

export const BLUEPRINTS: Record<ProjectInterest, ProjectBlueprint> = {
  'Resume & Career Tools': {
    id: 'resume-ats-copilot',
    interest: 'Resume & Career Tools',
    title: 'Smart ATS Resume Analyzer & Interview Copilot',
    category: 'Matched Blueprint • Portfolio-Ready AI Tool',
    feasibility: '98%',
    desc: 'An AI-powered web app that extracts resume bullet points, matches skills against job specs, and suggests tailored interview answers using free LLM APIs.',
    detailedDesc: "You'll build a working full-stack AI web app that ingests student resumes, evaluates keyword density against real job descriptions, and auto-generates customized interview behavioral questions using Gemini 1.5 Flash.",
    targetBranches: ['CSE', 'IT', 'AIML', 'ECE', 'OTHER'],
    difficulty: 'Beginner',
    techStack: ['Python 3.11', 'Google Gemini 1.5 Flash', 'Streamlit Cloud', 'PyPDF2 Parser'],
    milestones: [
      {
        timeframe: '00–20 Mins',
        milestoneNumber: 1,
        title: 'Python & LLM Scaffolding',
        desc: 'Initialize environment, authenticate Gemini API key, configure secure system prompts for HR matching.',
      },
      {
        timeframe: '20–45 Mins',
        milestoneNumber: 2,
        title: 'Resume Parsing & Scoring Logic',
        desc: 'Extract raw text from PDF uploads, compute semantic similarity scores, and flag critical missing tech keywords.',
      },
      {
        timeframe: '45–60 Mins',
        milestoneNumber: 3,
        title: 'Streamlit UI & Live Cloud Deploy',
        desc: 'Bind frontend components, test live candidate prompts, and deploy a shareable portfolio web app URL.',
      },
    ],
    portfolioImpact:
      'Demonstrates practical LLM integration, prompt engineering, and real-world utility that stands out in fresher campus placements and software engineering internships.',
  },
  'Chatbot': {
    id: 'campus-faq-rag-bot',
    interest: 'Chatbot',
    title: 'Campus FAQ & Exam Copilot with RAG',
    category: 'Matched Blueprint • Portfolio-Ready AI Tool',
    feasibility: '96%',
    desc: 'An AI assistant that ingests college syllabi and notices, giving instant concise answers with citations using an open LLM.',
    detailedDesc: 'Build a Retrieval-Augmented Generation (RAG) assistant that indexes your university department notices, exam schedules, and syllabus circulars into a fast vector store and responds to natural language queries.',
    targetBranches: ['CSE', 'IT', 'AIML'],
    difficulty: 'Beginner',
    techStack: ['Python 3.11', 'LangChain Light', 'Gemini 1.5 Flash', 'FAISS Vector Index', 'Streamlit UI'],
    milestones: [
      {
        timeframe: '00–20 Mins',
        milestoneNumber: 1,
        title: 'Vector Knowledge Store Scaffolding',
        desc: 'Convert university PDFs and circulars into semantic text chunks and build a local embedding vector store.',
      },
      {
        timeframe: '20–45 Mins',
        milestoneNumber: 2,
        title: 'RAG Prompt Pipeline & Citations',
        desc: 'Connect vector search context into Groq / Gemini API prompts with source page referencing.',
      },
      {
        timeframe: '45–60 Mins',
        milestoneNumber: 3,
        title: 'Interactive Web UI & Cloud Hosting',
        desc: 'Deploy a modern conversational chat interface accessible by classmates with quick-starter campus prompts.',
      },
    ],
    portfolioImpact:
      'Highlights state-of-the-art Retrieval-Augmented Generation (RAG) experience—the single most asked-about AI architecture in 2025 tech interviews.',
  },
  'Study Assistant': {
    id: 'study-assistant-audio-cards',
    interest: 'Study Assistant',
    title: 'Interactive Code Explainer & Audio Flashcards',
    category: 'Matched Blueprint • Portfolio-Ready AI Tool',
    feasibility: '95%',
    desc: 'A student productivity tool that turns dry textbook code examples into natural voice explanations and spaced-repetition quizzes.',
    detailedDesc: 'Transform complex DSA concepts and dry textbook algorithms into step-by-step interactive audio explanations, conceptual diagrams, and adaptive self-quizzes.',
    targetBranches: ['CSE', 'IT', 'AIML', 'ECE'],
    difficulty: 'Beginner',
    techStack: ['Python 3.11', 'Gemini 1.5 Flash', 'Edge-TTS Voice API', 'HTML5 Audio Web Player'],
    milestones: [
      {
        timeframe: '00–20 Mins',
        milestoneNumber: 1,
        title: 'Code Syntax Ingestion & Tokenizer',
        desc: 'Accept code or text snippet and detect syntax concepts, complexity bottlenecks, and data flow.',
      },
      {
        timeframe: '20–45 Mins',
        milestoneNumber: 2,
        title: 'Multi-Level Explanation Engine',
        desc: 'Run targeted prompting for multi-level difficulty summaries (EL5, Interview Ready, and Edge Cases).',
      },
      {
        timeframe: '45–60 Mins',
        milestoneNumber: 3,
        title: 'Spaced-Repetition Quiz & Audio Player',
        desc: 'Generate downloadable flashcard decks with voiceover preview and one-click export for revision.',
      },
    ],
    portfolioImpact:
      'Proves ability to combine multimodal generative AI (text + audio synthesis) with intuitive educational UX design.',
  },
  'Data Dashboard': {
    id: 'placement-analytics-dashboard',
    interest: 'Data Dashboard',
    title: 'Automated Placement Trend & Salary Intelligence',
    category: 'Matched Blueprint • Portfolio-Ready AI Tool',
    feasibility: '97%',
    desc: 'An automated dashboard analyzing engineering hiring trends, required skill tags, and tier-1 company compensation benchmarks.',
    detailedDesc: 'An automated intelligence dashboard that scours tech recruitment trends, maps required frameworks against campus curriculum, and recommends high-yield project ideas.',
    targetBranches: ['CSE', 'IT', 'AIML', 'ECE', 'OTHER'],
    difficulty: 'Beginner',
    techStack: ['Python 3.11', 'Pandas', 'Gemini 1.5 Flash', 'Plotly Interactive Charts', 'Streamlit'],
    milestones: [
      {
        timeframe: '00–20 Mins',
        milestoneNumber: 1,
        title: 'Hiring Data Cleanse & Normalization',
        desc: 'Clean placement salary trends and job postings into structured DataFrames with key industry tags.',
      },
      {
        timeframe: '20–45 Mins',
        milestoneNumber: 2,
        title: 'AI Trend Clustering & Skill Matching',
        desc: 'Use Gemini to cluster emerging tech stacks and highlight high-paying niche skills for freshers.',
      },
      {
        timeframe: '45–60 Mins',
        milestoneNumber: 3,
        title: 'Interactive Visual Analytics Portal',
        desc: 'Render interactive heatmaps, salary distributions, and downloadable interview prep roadmaps.',
      },
    ],
    portfolioImpact:
      'Demonstrates end-to-end data analytics and business intelligence mastery with executive visual presentation.',
  },
};

export function getRecommendedBlueprint(
  branch: AcademicBranch,
  interest: ProjectInterest,
  codingLevel: string
): ProjectBlueprint {
  return BLUEPRINTS[interest] || BLUEPRINTS['Resume & Career Tools'];
}
