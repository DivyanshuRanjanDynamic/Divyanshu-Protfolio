# Build "Divyanshu Ranjan" Portfolio Website

Copy everything below into Antigravity as your build instruction.

---

## 1. Project Overview

Build a modern, production-quality personal portfolio website for a software engineer, closely inspired by the design, layout, and visual polish of **https://www.adityathakur.me/** (a React-based single-page developer portfolio with hero section, animated skill/tech showcase, timeline-style experience section, project cards, and a contact section). Do **not** copy any of that site's code, personal content, images, or copyrighted assets — only take structural/UX inspiration (section order, layout rhythm, animation style, spacing, card design, dark/light theme toggle, smooth-scroll navigation). Replace all content with the details below.

**Tech stack (mandatory):**
- **Frontend:** React (Vite), TypeScript preferred, Tailwind CSS for styling, Framer Motion (or similar) for scroll/entrance animations, React Router if multi-page, otherwise single-page smooth-scroll navigation.
- **Backend:** Python (FastAPI), used both for (a) serving any contact-form / analytics endpoints and (b) powering the RAG chatbot described in Section 6.
- **Deployment target:** Frontend deployable to Vercel/Netlify; backend deployable to a service like Render/Railway/Fly.io or Docker container. Keep frontend and backend cleanly separated (`/frontend` and `/backend` folders in the repo) and communicating via a REST API.

---

## 2. Global Design Requirements

- Clean, minimal, developer-portfolio aesthetic: generous whitespace, one accent color (pick a modern accent — e.g., cyan/teal or electric blue — with a full light/dark theme), smooth section-to-section scroll, subtle scroll-triggered fade/slide-in animations for each section.
- Fully responsive (mobile-first): must look polished on phones, tablets, and desktop.
- Sticky/floating navbar with smooth-scroll links to each section, and a light/dark mode toggle.
- Favicon, custom OG image, and proper SEO meta tags (title, description, keywords, Open Graph, Twitter card) using the person's name and role.
- Subtle background elements (gradient blobs, grid pattern, or particle effect) similar in spirit to the inspiration site — tasteful, not distracting.
- Fast load: lazy-load below-the-fold sections/images, optimize assets.
- Include a floating "Chat with my AI Assistant" button (bottom-right) that opens the RAG chatbot widget described in Section 6 — this should be accessible from every section.

---

## 3. Site Content — Sections & Copy

### 3.1 Hero Section
- Name: **Divyanshu Ranjan**
- Role/tagline (rotating/animated text is a nice touch, similar to inspiration site): cycle through — "Full Stack Engineer", "AI Builder", "Backend Engineer", "Software Engineer"
- Short one-line intro: e.g., "I build scalable backend systems and AI-powered products — currently open to **Internship** and **Full-Time** opportunities."
- CTA buttons: "View Resume" (links to resume URL below), "Contact Me" (scrolls to contact section), and "Chat with my AI Assistant" (opens RAG bot).
- Social icons: GitHub, LinkedIn, Email — linking to the URLs in Section 5.

### 3.2 About Me
- B.Tech in Computer Science (AI & ML), **Techno Main Salt Lake**, GPA: **8.04/10**, **May 2023 – Jun 2027**.
- Brief narrative: interested in Full Stack Engineering, AI Builder work, Backend Engineering, and Software Engineering; actively building production systems (mention MechHub's incubation, SIH placement, DSA practice) and looking for internship or full-time roles.

### 3.3 Technical Skills
Present as categorized skill badges/pills or animated tech icons grid (like the inspiration site's skills marquee/grid):
- **Languages:** Java, Python, JavaScript, SQL
- **Backend:** Node.js, Express.js, REST APIs, WebSockets
- **Databases:** PostgreSQL, MongoDB, Redis
- **Frontend:** React.js, HTML, CSS
- **Tools & Cloud:** Git, Docker, AWS (EC2, S3), CI/CD
- **Core CS:** Data Structures & Algorithms, OOP, System Design (LLD/HLD)

### 3.4 Experience (timeline style)
**Backend Developer Intern — Synchubb Innovation Pvt. Ltd. (Remote)**
*Oct 2024 – Nov 2025*
Tech: Node.js, PostgreSQL, Docker, Kubernetes, WebSockets, WebRTC, JWT/OAuth
- Built a real-time collaboration platform supporting 1,000+ concurrent users with live co-editing, syncing updates within ~200ms.
- Added Google/GitHub OAuth sign-in, cutting login failures by 30% and closing a key security gap.
- Sped up core APIs by 25% by rewriting slow queries and adding database indexes.
- Containerized services on Kubernetes, achieving zero-downtime deployments across every release.

### 3.5 Projects (card grid, each with title, tech badges, description bullets, Live Demo + GitHub links)

1. **MechHub — Browser-Based CAD Platform**
   Live: https://www.mechhub.in/ | GitHub: https://github.com/DivyanshuRanjanDynamic/studio
   Tech: React.js, WebAssembly (OpenCascade), AWS (EC2, S3), Razorpay
   - Built a browser CAD tool rendering 3D models instantly, letting manufacturers skip desktop CAD software.
   - Designed backend with AWS auto-scaling (EC2, S3) for manufacturing-grade file uploads and concurrent design sessions.
   - Grew to 500+ customers and 10+ vendors; selected into the IIM Bangalore NSRCEL incubator.
   - Built end-to-end payments (checkout through webhooks) with zero failed transactions.

2. **ClipGenius-AI — Podcast-to-Clip Pipeline**
   Live: https://podclipper.vercel.app/ | GitHub: https://github.com/DivyanshuRanjanDynamic/ClipGenius-AI
   Tech: Python, gRPC, GPU Workers, AWS
   - Automated podcast editing into short clips using GPU-accelerated AI, cutting editing time 90% (~15s per clip).
   - Built a queued, back-pressure-aware pipeline so traffic spikes never dropped a job.

3. **ProConnect — Internship Matching Platform**
   Live: https://ignite-x-alpha.vercel.app/ | GitHub: https://github.com/DivyanshuRanjanDynamic/Ignite-X
   Tech: Node.js, Apache Kafka, MongoDB, Redis, Prisma
   - Built a recommendation engine matching candidates to roles with 92% accuracy in under 200ms, no GPU required.
   - Automated data intake from the PM Internship Portal, cutting admin workload by 35%.

4. **AI Agent — Intelligent Code Assistant**
   GitHub: https://github.com/DivyanshuRanjanDynamic/Agentic_Ai_Vibe_Coder
   - AI-powered code generation using Groq API with Llama 4 Maverick 17B.
   - Executes Linux/bash commands directly from the agent.
   - Multi-modal thinking workflow: START → THINK → ACTION → OBSERVE → OUTPUT.
   - JSON-based structured communication and an extensible tool system.

5. **SyncHubb — Collaborative Developer Platform**
   Live: https://www.synchubb.in/ | GitHub: https://github.com/DivyanshuRanjanDynamic/SynchubbAuth
   - Integrated team management, real-time chat, video conferencing, task management, and an AI-powered VS Code-like coding environment.
   - Microservices architecture with dedicated Auth, Matri, Media API, and WebSocket services for independent deployment.
   - Real-time communication via WebSockets/Socket.io and Mediasoup SFU for low-latency messaging and scalable multi-user video.
   - Secure backend APIs/auth with Node.js, Express, MongoDB, Redis, Docker; role-based access with service-level separation.

### 3.6 Achievements
- IIM Bangalore NSRCEL Incubation — selected for MechHub after reaching 500+ customers and 10+ vendors.
- Smart India Hackathon 2024 (SIH) — placed among the top teams out of 50+ competing colleges.
- 450+ DSA problems solved across LeetCode and TakeUForward.org.

### 3.7 Contact
- Phone: 9142140020
- Email: divyanshu.work914214@gmail.com
- LinkedIn: https://www.linkedin.com/in/divyanshu-ranjan-6b3b37277/
- GitHub: https://github.com/DivyanshuRanjanDynamic
- Resume (view/download button): https://1drv.ms/b/c/ec04afbe3c304831/IQCoUeLZmg09QbqKvtR_WMGlAdUy6oQM86RJazeR5amfmmE?e=5ccO2h
- Include a working contact form (Name, Email, Message) that POSTs to a FastAPI `/api/contact` endpoint, which sends an email notification (e.g., via SMTP or a transactional email API) or stores the message for later retrieval.

---

## 4. Navigation Structure
Hero → About → Skills → Experience → Projects → Achievements → Contact, with the AI Assistant available as a persistent floating widget throughout.

---

## 5. Resume/Source-of-Truth Data File
Create a single structured JSON/YAML file (e.g., `backend/data/profile.json`) containing all of the above content (skills, experience, projects, achievements, contact, education) as the single source of truth. Both the frontend content and the RAG chatbot's knowledge base should be generated/derived from this file so updates only need to happen in one place.

---

## 6. RAG Chatbot — "Ask My AI Assistant" (core differentiating feature)

Build a Retrieval-Augmented Generation chatbot embedded in the portfolio so recruiters/visitors can chat directly instead of manually reading every section. It should let a recruiter describe a role's requirements and get a clear, evidence-based answer on fit, citing specific projects/experience.

### 6.1 Functional Requirements
- Floating chat widget (bottom-right icon) that expands into a chat panel; works well on mobile.
- Answers questions about: skills/tech stack, work experience, each project (with its live demo & GitHub links), education, achievements, resume, and contact details.
- Supports natural recruiter-style prompts, e.g., "We need someone with Node.js, Kafka, and Docker experience for a backend role — does Divyanshu fit?" and responds with a clear yes/partial/no plus supporting evidence (specific project bullets, quantified metrics) pulled from retrieved chunks.
- Always grounds answers in retrieved content — no hallucinated skills/claims. If something isn't in the knowledge base, the bot should say so honestly and offer to connect the recruiter via email/LinkedIn instead of guessing.
- Include quick-action suggested prompts (e.g., "Summarize his backend experience", "Is he available for internships?", "Show projects using AWS").
- Bot responses should include clickable links (GitHub/live demo/LinkedIn/resume) when relevant.

### 6.2 Ingestion & Chunking Pipeline
- Ingest structured content from `profile.json`/`profile.yaml` (Section 5) plus the actual resume PDF (from the resume link — download and store a local copy for ingestion).
- Chunk content logically: one chunk per project, one per experience entry, one per skill category, one for education, one for achievements, one for contact — rather than arbitrary fixed-length splitting, so retrieval returns coherent, self-contained context. For the resume PDF specifically, extract text and additionally chunk by section with a reasonable token-based fallback (e.g., ~300–500 tokens per chunk with overlap) in case formatting is inconsistent.
- Store chunk metadata (source type: "project" / "experience" / "skills" / "education" / "achievement" / "contact" / "resume", and any relevant tags like tech stack keywords) alongside each chunk to support filtered retrieval.

### 6.3 Embedding & Vector Store
- Generate embeddings for each chunk using an embedding model (e.g., OpenAI `text-embedding-3-small`, or a local/open-source model such as `sentence-transformers` if avoiding API costs — let Antigravity pick a sensible default and make it configurable via environment variable).
- Store embeddings in a lightweight vector database suitable for a small, mostly-static knowledge base — e.g., **ChromaDB** (local, file-based, easy with Python/FastAPI) or FAISS. Persist the index to disk so it doesn't need to be rebuilt on every server restart; provide a script (`ingest.py`) to rebuild it whenever `profile.json` or the resume changes.

### 6.4 Retrieval + Generation Flow (FastAPI backend)
- `POST /api/chat` endpoint: accepts `{ message, conversation_history }`.
- Embed the incoming query, retrieve top-k relevant chunks (k configurable, e.g., 4–6) from the vector store, optionally with metadata filtering (e.g., if the query mentions "backend" or "AWS", bias retrieval toward matching tags).
- Construct a system prompt instructing the LLM to: act as Divyanshu's professional portfolio assistant; answer only using the provided context; be concise, professional, and recruiter-friendly; cite specific projects/metrics; be honest about gaps; never invent skills or experience not present in the context; include relevant links from the context when helpful.
- Call an LLM (configurable provider — e.g., OpenAI/Anthropic/Groq API key via environment variable) with the system prompt + retrieved context + conversation history + user message, and stream or return the response.
- Maintain lightweight conversation memory per session (in-memory or session-keyed) so follow-up questions work naturally.

### 6.5 Non-Functional Requirements
- Rate-limit the chat endpoint to prevent abuse (e.g., simple IP-based limiter).
- Handle API errors gracefully with a friendly fallback message and a way to contact Divyanshu directly.
- Keep API keys server-side only (never expose in frontend code); use `.env` for secrets with a `.env.example` template.
- Log conversations (optionally) for Divyanshu to review what recruiters are asking, stored locally or in a simple database table.

---

## 7. Deliverables Antigravity Should Produce
1. `/frontend` — React + Tailwind portfolio app matching the structure/content above, fully responsive, with light/dark mode and animations.
2. `/backend` — FastAPI app with:
   - `/api/contact` endpoint for the contact form.
   - `/api/chat` endpoint powering the RAG chatbot.
   - `ingest.py` script to chunk, embed, and index `profile.json` + resume PDF into the vector store.
   - `data/profile.json` as the single source of truth for all content above.
3. `README.md` explaining how to run both frontend and backend locally, set environment variables (LLM API key, embedding provider), and rebuild the RAG index after content changes.
4. `.env.example` files for both frontend (if needed) and backend, listing all required environment variables without real secret values.

---

## 8. Explicit Constraints
- Do not reuse any code, images, or text verbatim from https://www.adityathakur.me/ — inspiration for layout/UX only.
- Use only the content specified above; do not invent additional projects, skills, or achievements.
- Keep the codebase clean, modular, and well-commented so Divyanshu can maintain it himself going forward.