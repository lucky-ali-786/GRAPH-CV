# Graph CV 🚀 | AI-Powered Resume Roaster & ATS Evaluator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

**Graph CV** is a high-performance, asynchronous AI application designed to evaluate, critique, and enhance resumes. By decoupling heavy LLM processing from the main application thread using a **BullMQ** message queue and **LangGraph** multi-agent pipelines, this platform ensures a seamless, non-blocking user experience even during complex document analysis.

## ✨ Core Features

* **Resume Roaster:** Deep-dives into document flaws, aggressively flagging vague bullet points, missing quantifiable metrics, and weak action verbs.
* **Resume Enhancer:** Processes and rewrites specific document sections in parallel to elevate overall ATS impact and readability.
* **ATS Evaluator:** Compares uploaded resumes against targeted Job Descriptions (JDs) to generate precise match metrics and compatibility scores.
* **Integrated LaTeX Editor:** Empowers users to make immediate formatting and content adjustments based on AI feedback, rendering PDF changes directly in the browser.

---

## 🧠 System Architecture

Evaluating complex documents with LLMs synchronously often leads to API timeouts and a frozen client UI. Graph CV solves this bottleneck through a decoupled, event-driven architecture:

1. **Ingestion & Queueing:** A user uploads a resume via the React frontend. The Node.js backend immediately generates a Job ID and offloads the task to a **BullMQ** message queue, keeping the main thread free.
2. **Document Parsing:** Background workers pick up the job. Image-based documents are extracted as raw bytes (rather than base64) to heavily optimize **Gemini API** token efficiency and processing stability.
3. **Parallel Evaluation:** The extracted data enters a **LangGraph** multi-agent flow. Dedicated Gemini agents evaluate the *Experience*, *Projects*, and *Achievements* sections simultaneously, drastically reducing overall AI latency.
4. **Final Judge:** A synthesis node aggregates the parallel outputs, enforces a strict JSON schema, and writes the structured feedback to the database for client retrieval.

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Queue System & State:** BullMQ, Redis
* **AI / LLM:** Google Gemini API, LangGraph
* **Infrastructure:** Docker (for containerized background workers)

---

## 🚀 Getting Started

Follow these instructions to set up and run the system on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or higher)
* Redis (Running locally or via Docker)
* Google Gemini API Key

### 1. Clone the Repository

```bash
git clone [https://github.com/lucky-ali-786/graph-cv.git](https://github.com/lucky-ali-786/graph-cv.git)
cd graph-cv
```

### 2. Install Dependencies

Install the required packages for both the backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory and configure your API keys and ports:

```env
PORT=5000
GEMINI_API_KEY="your_gemini_api_key"
REDIS_URL="redis://127.0.0.1:6379"
```

### 4. Run the Development Servers

Because of the decoupled architecture, you need to run the backend server, the background queue worker, and the frontend client simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```

**Terminal 2: Start the Background Worker**
```bash
cd backend
npm run worker
```

**Terminal 3: Start the React Frontend**
```bash
cd frontend
npm run start
```
