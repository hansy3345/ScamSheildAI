# ScamShield AI 🛡️
> **"Think before you click."** — AI-Powered Autonomous Scam & Phishing Detection Platform.

ScamShield AI helps ordinary users detect suspicious messages, screenshots, emails, URLs, job offers, and UPI payment requests before falling victim to cyber deception.

---

## ✨ Key Features

- **Multimodal AI Analysis**: Submit text, screenshots, links, emails, and job offers.
- **6-Stage Agentic Pipeline**: Autonomous agents for Content Parsing, Pattern Detection, Domain Forensics, Evidence Aggregation, Risk Assessment, and Safety Containment.
- **Explainable Threat Reports**: Animated circular risk score (0-100), risk levels (Safe, Suspicious, High Risk, Critical), evidence logs, and Do's & Don'ts checklists.
- **Real-Time Analytics Dashboard**: Interactive charts (Donut risk distribution, Area threat trends, Category bars) with zero hardcoded values.
- **Searchable Investigation History**: Filter, sort, view, and delete past analyses directly in the browser.
- **Scam Defense Safety Center**: Interactive guides on UPI fraud, Digital Arrest scams, fake parcel SMS, and an interactive Cyber Awareness Quiz.
- **Premium Cybersecurity UI**: Deep dark base, dynamic cyan/violet gradients, canvas particle animations, smooth page transitions, and dark/light theme toggle.
- **Multi-language Ready**: Built to support English, Hindi, and Telugu.

---

## 🚀 Quick Start (Frontend)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🐍 Backend Setup (FastAPI + Gemini AI)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# 5. Run server
python app/main.py
```

Backend will run on [http://localhost:8000](http://localhost:8000).

---

## 🏗️ Architecture

```
scamshieldAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, ThemeToggle, AnimatedBackground
│   │   │   └── ui/           # Button, Card, Badge, Modal, Skeleton, EmptyState
│   │   ├── pages/            # Landing, Analyze, Scan, Results, Dashboard, History, Safety, HowItWorks
│   │   ├── store/            # AnalysisContext, ThemeContext
│   │   ├── services/         # api.ts, mockData.ts
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # helpers.ts, constants.ts
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point & CORS
│   │   ├── services/         # gemini_service.py (Gemini 2.0 Flash)
│   │   └── models/           # schemas.py (Pydantic models)
│   └── requirements.txt
└── README.md
```
