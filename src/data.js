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
  { id: 'open-source', label: 'Open Source' },
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
  role: 'AI / Full Stack Engineering Intern',
  company: 'AssessHub',
  period: 'Jun 2026 – Present',
  summary: 'Building an in-house CRM and AI sales tools that replaced HubSpot for the sales team.',
  stack: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'Gemini AI', 'Microsoft Graph', 'Playwright'],
  details: [
    { t: 'A CRM that replaced HubSpot', d: 'Contacts, companies, a drag-and-drop deals board, tasks, calls, meetings, documents and reports, covering 25,000 contacts, 23,000 companies and 119,000 calls.' },
    { t: 'Sales knowledge base', d: 'Reads about 20,000 sales emails and their attachments through Microsoft Graph. Gemini sorts each deal into won, lost or active and pulls out lost reasons, pain points, objections and what worked.' },
    { t: 'Deal Advisor', d: 'Takes a company website, email address or pasted email and returns a briefing on where the account stands and how to win it, using only facts from the knowledge base. For new prospects it shows how similar past deals closed.' },
    { t: 'AI call scoring', d: "Gemini reads sales call transcripts and scores each deal's chance of closing, with ranked next steps. Tuned the prompt over 3 rounds so scores spread from cold to hot instead of all sitting near 50%." },
    { t: 'Role-based access control', d: 'Each role decides which pages, actions and records a person can see, and every check fails closed.' },
    { t: 'Website lead capture', d: 'A chatbot, embeddable forms and a demo booking page that reads real calendar free time, creates Teams meeting links and puts each lead straight into the CRM.' },
    { t: 'Email sequence engine', d: 'Enrols contacts, sends emails, detects replies and measures results. Rebuilt old HubSpot sequence results from email records with 98.8% accuracy.' },
    { t: 'LinkedIn outreach app', d: 'Prospects, campaigns, an inbox and AI-written messages, run by a Playwright browser robot that works at a human pace.' },
  ],
};

export const featured = {
  id: 'SYS-00',
  name: 'AssessHub Sales Platform',
  category: 'AI // CRM',
  blurb: 'An in-house CRM and AI sales tools that replaced HubSpot, built on a knowledge base of about 20,000 sales emails.',
  long: 'An in-house CRM and set of AI sales tools that replaced HubSpot for the sales team. About 20,000 sales emails and their attachments are read through Microsoft Graph, cleaned of noise such as newsletters, and grouped into about 12,000 threads. Gemini sorts each deal into won, lost or active and pulls out the lost reason, pain points, objections, what worked and the key lesson. The Deal Advisor turns that into a briefing for the rep, and it may only use facts from the knowledge base: if nothing supports a point, it says "no signal" instead of making something up.',
  points: [
    'Replaced HubSpot for the sales team',
    'Knowledge base from ~20,000 sales emails',
    'Deal Advisor that only uses real facts',
    'AI chance-to-close call scoring',
    'Reports, dashboards & role-based access',
    'Lead capture, sequences & LinkedIn outreach',
  ],
  stack: ['Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Microsoft Graph', 'Playwright'],
  flow: ['Sales emails', 'Knowledge base', 'Gemini analysis', 'Deal briefing'],
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
    stack: ['Python', 'FastAPI', 'Groq', 'FastEmbed', 'FAISS'],
    github: 'https://github.com/anya-xcode/Highwatch-rag',
    live: 'https://highwatch-rag-491f.onrender.com/',
  },
  {
    id: 'SYS-02',
    tags: ['fullstack'],
    name: 'DSAForge',
    category: 'DEV TOOLS // FULL-STACK',
    image: '/images/projects/dsaforge.webp',
    blurb: 'A LeetCode-style workspace for the Striver A2Z sheet that commits every accepted solution to GitHub.',
    long: 'A DSA practice workspace built around the Striver A2Z sheet: 454 solvable problems with hidden tests, a Monaco code editor, and Python solutions judged in an isolated sandbox with no network access and CPU, memory and output limits. Each problem can hold several approaches side by side (brute force, better, optimal) with a code diff and complexity table, and every accepted approach is committed to a GitHub repository of your choice along with a generated problem statement and README.',
    points: ['Monaco editor with Run & Submit', 'Sandboxed Python judge with real verdicts', 'Multiple approaches per problem', 'Auto-commits accepted solutions to GitHub'],
    stack: ['React', 'Express', 'MongoDB', 'Monaco Editor', 'Docker'],
    github: 'https://github.com/anya-xcode/progit',
    live: 'https://progit-frontend-blond.vercel.app/',
  },
  {
    id: 'SYS-03',
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
    id: 'SYS-04',
    tags: ['fullstack'],
    name: 'Tourism Explorer',
    category: 'TRAVEL // FULL-STACK',
    image: '/images/projects/tourism.webp',
    blurb: 'A community travel platform for finding places through real visitor reviews, photos and short video reels.',
    long: 'A full-stack community travel platform where travellers add places with structured details (location, budget, opening hours, visit duration and tags), share reviews, photos and short video reels, and explore everything on an interactive Google Map. It also compares estimated ride fares across providers and lets people schedule group visits. The TypeScript back-end is built around object-oriented design patterns (Strategy for ride fares, Observer for notifications, Composite for discussion threads and Factory for services), with JWT and Google sign-in, Cloudinary media storage and UML design docs.',
    points: ['Interactive Google Map of places', 'Reviews, photos & video reels', 'Ride fare comparison & group visits', 'OOP design patterns in TypeScript'],
    stack: ['React', 'TypeScript', 'Express', 'MongoDB', 'Google Maps'],
    github: 'https://github.com/anya-xcode/Tourism',
    live: 'https://tourismfront-sigma.vercel.app/',
  },
  {
    id: 'SYS-05',
    tags: ['ai'],
    name: 'Solar Forecasting & Grid Agent',
    category: 'ML // AGENTS',
    image: '/images/projects/solar.webp',
    blurb: 'Machine-learning solar forecasting paired with an AI agent for energy-grid workflows.',
    long: 'A machine-learning system that forecasts solar power generation, combined with an AI agent that turns the forecasts into structured grid-optimisation recommendations.',
    points: ['ML-based solar forecasting', 'AI agent for energy-grid workflows', 'Structured recommendations'],
    stack: ['Python', 'Random Forest', 'Linear Regression', 'LangGraph', 'Streamlit'],
    github: 'https://github.com/QUBITABHAY/Intelligent-Solar-Energy-Generation-Forecasting',
    live: 'https://intelligent-solar-energy-generation-forecasting-78ssbnfr55sf6b.streamlit.app/',
  },
  {
    id: 'SYS-06',
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
    id: 'SYS-07',
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
    id: 'SYS-08',
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

/**
 * Open-source pull requests. The section is fully automatic: on every page load it fetches
 * your merged and open PRs from GitHub, so nothing here needs editing for new contributions.
 *  - Repos owned by a GitHub organization appear on their own; closed (unmerged) PRs are hidden.
 *  - Repos owned by a person (friends' or team projects) are hidden unless listed in `repos`.
 *  - `repos` gives hand-written descriptions (GitHub's own text is used otherwise);
 *    stars and language always come live from GitHub, these values are only the fallback.
 *  - `exclude` hides a repo even if an organization owns it, e.g. 'some-org/some-repo'.
 *  - `prs` is the snapshot shown only when GitHub can't be reached.
 */
export const openSource = {
  user: 'anya-xcode',
  exclude: [],
  snapshot: '2026-11-12',
  repos: {
    'ohcnetwork/care_fe': { about: 'Digital public good for healthcare delivery', stars: 686, lang: 'TypeScript' },
    'drawdb-io/drawdb': { about: 'Database diagram editor and SQL generator', stars: 40311, lang: 'JavaScript' },
    'SigNoz/signoz': { about: 'OpenTelemetry-native observability platform', stars: 32598, lang: 'TypeScript' },
    'altair-graphql/altair': { about: 'Feature-rich GraphQL client for every platform', stars: 5436, lang: 'TypeScript' },
    'Catrobat/Paintroid': { about: 'Image editor for the Catroid creative-coding app', stars: 507, lang: 'Kotlin' },
    'sugarlabs/www': { about: 'The Sugar Labs website', stars: 88, lang: 'HTML' },
    'OpenCodeChicago/hacktoberfest-2025-frontend': { about: 'Hacktoberfest 2025 e-commerce storefront', stars: 28, lang: 'JavaScript' },
    'nst-sdc/NotesShaaring-Platform': { about: 'Student notes-sharing platform, built in the open', lang: 'JavaScript' },
  },
  prs: [
    { repo: 'ohcnetwork/care_fe', number: 16958, state: 'open', date: '2026-10-12', title: 'fix: validate file size in the questionnaire file question before upload' },
    { repo: 'ohcnetwork/care_fe', number: 16928, state: 'open', date: '2026-10-01', title: 'refactor: migrate container forks to shared ResponsiveDialog' },
    { repo: 'ohcnetwork/care_fe', number: 16923, state: 'open', date: '2026-09-30', title: 'fix: reject whitespace-only input in settings definition forms' },
    { repo: 'ohcnetwork/care_fe', number: 16903, state: 'merged', date: '2026-11-10', title: 'fix: restore missing file_too_large translation key' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 172, state: 'merged', date: '2026-02-02', title: 'feat: update favicon for new branding' },
    { repo: 'Catrobat/Paintroid', number: 1355, state: 'open', date: '2025-12-07', title: 'fix PAINTROID-802 Add clear button to clipboard tool' },
    { repo: 'drawdb-io/drawdb', number: 786, state: 'merged', date: '2025-12-03', title: 'Added Swahili (sw) Language Support' },
    { repo: 'SigNoz/signoz', number: 9659, state: 'open', date: '2025-11-23', title: 'Fix timeshift + formula combination when aggregation interval >= time…' },
    { repo: 'altair-graphql/altair', number: 2938, state: 'open', date: '2025-11-22', title: 'Improve theme customization documentation and fix plugin light theme …' },
    { repo: 'OpenCodeChicago/hacktoberfest-2025-frontend', number: 218, state: 'merged', date: '2025-10-23', title: 'Add favicon and logo variations for light and dark mode' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 144, state: 'merged', date: '2025-07-10', title: 'Extract Meaningful Keywords from Notes Using NLP Utility Function' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 141, state: 'merged', date: '2025-07-10', title: 'Integrate Google Custom Search API to Fetch Related Educational Articles' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 140, state: 'merged', date: '2025-07-10', title: 'Integrate YouTube Data API to Fetch Related Educational Videos' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 134, state: 'merged', date: '2025-07-09', title: 'Integrate Automatic Difficulty Estimation in Note Upload Controller' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 131, state: 'merged', date: '2025-07-08', title: 'add summary field to Notes schema and API responses (#116)' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 108, state: 'merged', date: '2025-07-05', title: 'fix sighup page ui' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 102, state: 'merged', date: '2025-07-04', title: 'Add UI Screenshots to README for Visual Clarity' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 100, state: 'merged', date: '2025-07-03', title: 'add reviewed filter in browse notes section' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 99, state: 'merged', date: '2025-07-03', title: 'add edit on my upload notes section' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 95, state: 'merged', date: '2025-07-03', title: 'Enhanced UI of Add button in Add/View Reviews section' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 91, state: 'merged', date: '2025-07-02', title: 'Implement forgot and reset password functionality (#77)' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 61, state: 'merged', date: '2025-06-26', title: 'Update navbar to reflect auth state after login/signup' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 45, state: 'merged', date: '2025-06-24', title: 'Registered Users Unable to Login Wrong Credentials Issue & restrict navbar options for unauthenticated users' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 40, state: 'merged', date: '2025-06-23', title: 'Connect with backend,Fix signup fullName bug and update user registration' },
    { repo: 'nst-sdc/NotesShaaring-Platform', number: 17, state: 'merged', date: '2025-06-18', title: 'Add responsive Sign Up Page with validation' },
    { repo: 'sugarlabs/www', number: 663, state: 'merged', date: '2025-01-31', title: 'Fixes #659 Lack of Gap Between' },
  ],
};

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
