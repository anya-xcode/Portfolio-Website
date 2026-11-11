export const profile = {
  name: 'ANANYA GUPTA',
  role: 'AI ENGINEER // FULL-STACK DEVELOPER',
  tagline: 'Building intelligent systems, scalable applications and AI-powered experiences.',
  email: 'ananya.gupta@adypu.edu.in',
  github: 'https://github.com/anya-xcode',
  linkedin: 'https://www.linkedin.com/in/ananya-gupta-7235a5319/',
  resume: '/resume/Ananya-Gupta-Resume.pdf',
  resumeAi: '/resume/Ananya-Gupta-Resume-AI-ML.pdf',
  leetcode: 'https://leetcode.com/u/anya_code/',
  codeforces: 'https://codeforces.com/profile/anya_code',
  twitter: 'https://twitter.com/anya_xcode',
};

export const platforms = [
  {
    id: 'codeforces',
    name: 'Codeforces',
    handle: 'anya_code',
    url: 'https://codeforces.com/profile/anya_code',
    display: 'codeforces.com/profile/anya_code',
    tag: 'COMPETITIVE // C++',
    points: ['Active competitive programmer', 'Regular contest participation', 'Problem solving in C++'],
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    handle: 'anya_code',
    url: 'https://leetcode.com/u/anya_code/',
    display: 'leetcode.com/u/anya_code',
    tag: 'DSA // INTERVIEW PREP',
    points: ['DSA practice & problem solving', 'Array, String, DP patterns', 'Interview preparation focus'],
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: 'anya-xcode',
    url: 'https://github.com/anya-xcode',
    display: 'github.com/anya-xcode',
    tag: 'OPEN SOURCE // BUILD',
    points: ['Open-source contributions', 'Active project development', 'Collaborative coding'],
  },
];

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'contact', label: 'Contact' },
];

export const focusAreas = [
  { k: '01', t: 'Full-stack development', d: 'React front-ends and Node.js / Express back-ends, shipped as complete products.' },
  { k: '02', t: 'AI & machine learning', d: 'Computer Science with a specialisation in AI & ML, applied to real problems.' },
  { k: '03', t: 'Generative AI & agents', d: 'LLM integration, retrieval-augmented generation and agent-driven workflows.' },
  { k: '04', t: 'Backend architecture', d: 'REST API design, database modelling and dependable service boundaries.' },
];

export const experience = {
  role: 'Software Engineer Intern',
  company: 'AssessHub',
  period: 'May 2026 – Present',
  summary: 'Working across the stack on a CRM and AI-powered sales automation product.',
  stack: ['React', 'Node.js', 'MongoDB', 'RAG', 'Microsoft 365 API'],
  details: [
    { t: 'CRM & sales automation', d: 'Building CRM functionality and automation around the sales workflow.' },
    { t: 'AI sales assistants & client intelligence', d: 'Developing AI-powered assistants that analyse client communication and surface insight for sales teams.' },
    { t: 'Retrieval-Augmented Generation', d: "Designing client-specific knowledge bases so answers are grounded in each client's own data." },
    { t: 'Microsoft 365 email integration', d: 'Ingesting and cleaning email conversations, attachments and documents through the Microsoft 365 APIs.' },
    { t: 'Backend APIs, workflows & dashboards', d: 'Node.js and MongoDB back-ends, database workflows and dashboards on top of them.' },
  ],
};

export const featured = {
  id: 'SYS-00',
  name: 'SalesBot — AI-Powered CRM',
  category: 'AI // CRM',
  blurb: 'AI-powered sales automation with client-specific knowledge bases, email intelligence and deal tracking.',
  long: 'An AI-powered CRM built around sales automation. Each client gets its own knowledge base, email conversations feed an intelligence layer, and deals are tracked in one place.',
  points: ['AI-powered sales automation', 'Client-specific knowledge bases', 'Email intelligence', 'Deal tracking'],
  stack: ['React', 'Node.js', 'MongoDB'],
  flow: ['Knowledge base', 'Email intel', 'AI assistant', 'Deal tracking'],
};

export const projectFilters = [
  { id: 'all', label: 'All Systems' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'fullstack', label: 'Full-Stack' },
];

export const projects = [
  {
    id: 'SYS-01',
    tags: ['ai'],
    name: 'Highwatch Drive — RAG System',
    category: 'AI // RAG',
    image: '/images/projects/highwatch.webp',
    blurb: 'Chat with your documents: semantic search and contextual AI answers over Google Drive content.',
    long: 'A Retrieval-Augmented Generation system that lets users query their Google Drive documents in natural language, using semantic search to ground the AI responses in the source material.',
    points: ['Intelligent document retrieval', 'Semantic search', 'Contextual AI responses', 'Document processing & knowledge retrieval'],
    stack: ['Python', 'LangChain', 'OpenAI', 'FAISS'],
    github: 'https://github.com/anya-xcode/Highwatch-rag',
    live: 'https://highwatch-rag-491f.onrender.com/',
  },
  {
    id: 'SYS-02',
    tags: ['fullstack'],
    name: 'iPREP',
    category: 'EDTECH // FULL-STACK',
    image: '/images/projects/iprep.webp',
    blurb: 'An interview-preparation platform where students share and learn from real interview experiences.',
    long: 'An educational technology platform for Newton School of Technology students: an interactive learning experience built around shared interview experiences, with moderation, AI-assisted answers and a placement tracker.',
    points: ['Educational technology platform', 'Interactive learning experience', 'Moderation & AI-assisted answers', 'Placement tracker'],
    stack: ['React.js', 'Express.js', 'MongoDB', 'Prisma ORM'],
    github: 'https://github.com/anya-xcode/IPREP',
    live: 'https://iprep-xi.vercel.app/',
  },
  {
    id: 'SYS-03',
    tags: ['ai'],
    name: 'Solar Forecasting & Grid Agent',
    category: 'ML // AGENTS',
    image: '/images/projects/solar.webp',
    blurb: 'Machine-learning solar forecasting paired with an AI agent for energy-grid workflows.',
    long: 'A machine-learning system that forecasts solar power generation, combined with an AI agent that turns the forecasts into structured grid-optimisation recommendations.',
    points: ['ML-based solar forecasting', 'AI agent for energy-grid workflows', 'Structured recommendations'],
    stack: ['Python', 'Random Forest', 'Linear Regression', 'Streamlit'],
    github: 'https://github.com/QUBITABHAY/Intelligent-Solar-Energy-Generation-Forecasting',
    live: 'https://intelligent-solar-energy-generation-forecasting-78ssbnfr55sf6b.streamlit.app/',
  },
  {
    id: 'SYS-04',
    tags: ['fullstack'],
    name: 'Notes Sharing Platform',
    category: 'OPEN SOURCE // FULL-STACK',
    image: '/images/projects/notes.webp',
    blurb: 'A collaborative platform for students to share, browse and download academic notes.',
    long: 'An open-source collaborative web application for students to share, browse and download academic notes, with secure authentication, category-based browsing and collaboration features.',
    points: ['Secure authentication', 'Category-based browsing', 'Upload & download notes', 'Open-source collaboration'],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/nst-sdc/NotesShaaring-Platform',
    live: 'https://notes-shaaring-platform.vercel.app/',
  },
  {
    id: 'SYS-05',
    tags: ['fullstack'],
    name: 'Real Estate Platform',
    category: 'PROPTECH // FULL-STACK',
    image: '/images/projects/realestate.webp',
    blurb: 'List, explore and manage properties with maps, Google sign-in and an EMI calculator.',
    long: 'A full-stack real estate platform for listing, exploring and managing properties, with Google OAuth, map-based visualisation, Cloudinary image storage and a loan EMI calculator.',
    points: ['Google OAuth sign-in', 'Map-based property visualisation', 'Cloudinary image storage', 'Loan EMI calculator'],
    stack: ['React.js', 'Node.js', 'Prisma ORM', 'MySQL'],
    github: 'https://github.com/anya-xcode/Real-Estate',
    live: 'https://real-estate-qebn.vercel.app/',
  },
  {
    id: 'SYS-06',
    tags: ['fullstack'],
    name: 'Total Office Solutions',
    category: 'E-COMMERCE // FULL-STACK',
    image: '/images/projects/tos.webp',
    blurb: 'An office-products store with separate admin and user modules and an admin dashboard.',
    long: 'A full-stack e-commerce application for office products, with separate admin and user modules, real-time updates, automated emails and an admin dashboard.',
    points: ['Admin & user modules', 'Real-time updates', 'Automated emails', 'Admin dashboard'],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/anya-xcode/tos',
    live: 'https://tos-new.vercel.app/',
  },
];

export const skills = [
  { id: 'Frontend', items: ['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Flutter'] },
  { id: 'Backend / Database', items: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'MySQL', 'PostgreSQL'] },
  { id: 'AI & ML', items: ['Python', 'Machine Learning', 'Generative AI', 'RAG', 'AI Agents', 'LLM Integration'] },
  { id: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Postman'] },
];

export const layers = [
  { id: 'L1', name: 'Frontend', tag: 'LAYER 01 // INTERFACE', tech: ['React', 'Tailwind', 'Framer Motion'],
    d: 'Where the user meets the system. Responsive, accessible interfaces that make complex data and AI output easy to read and act on.' },
  { id: 'L2', name: 'API Layer', tag: 'LAYER 02 // CONTRACT', tech: ['REST', 'Validation', 'Auth'],
    d: 'A clear contract between client and server: well-shaped endpoints, input validation and authentication before anything reaches business logic.' },
  { id: 'L3', name: 'Backend Services', tag: 'LAYER 03 // LOGIC', tech: ['Node.js', 'Express', 'Workflows'],
    d: 'Business logic and orchestration: integrations such as email, background workflows, and the glue that coordinates data and AI calls.' },
  { id: 'L4', name: 'Database', tag: 'LAYER 04 // MEMORY', tech: ['MongoDB', 'MySQL', 'PostgreSQL'],
    d: 'Durable state. Data modelled around how it is queried, so the product stays fast and the AI layer has clean material to retrieve from.' },
  { id: 'L5', name: 'AI / LLM Layer', tag: 'LAYER 05 // INTELLIGENCE', tech: ['LLMs', 'RAG', 'Agents'],
    d: 'Models grounded in real data. Retrieval supplies context, the LLM reasons over it, and agents turn the result into actions.' },
];
