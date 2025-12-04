# 🤖 AI Code Review Assistant

> **Transform your code with AI-powered reviews in seconds**

A beautiful, full-stack application that uses AI to review your code, suggest improvements, and provide detailed analysis - all powered by Ollama's local LLM.

**Built by Shreejit Bhakte** | Powered by Ollama

---

## 📖 What Does It Do?

Upload any code file → Get instant AI review → Download detailed report

Simple as that! The AI analyzes your code for:
- 🐛 **Bugs & Issues** - Find problems before they happen
- ✨ **Improvements** - Get better, cleaner code
- 📊 **Severity Analysis** - Know what to fix first
- 📝 **Detailed Reports** - Export as PDF or JSON

---

## 🎯 How It Works - Data Flow

```
┌─────────────┐
│   Upload    │  You upload a code file (.py, .js, .java, etc.)
│   Code File │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌────────────┐    ┌──────────────┐   ┌──────────────┐ │
│  │ File Upload│───▶│  API Client  │──▶│ Display UI   │ │
│  │ Component  │    │  (Axios)     │   │ Components   │ │
│  └────────────┘    └──────┬───────┘   └──────────────┘ │
└────────────────────────────┼────────────────────────────┘
                             │ HTTP POST /api/review
                             │ (multipart/form-data)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│  ┌────────────┐    ┌──────────────┐   ┌──────────────┐ │
│  │   Route    │───▶│   Service    │──▶│  LLM Service │ │
│  │ /api/review│    │   Layer      │   │  (Ollama)    │ │
│  └────────────┘    └──────────────┘   └──────┬───────┘ │
└────────────────────────────────────────────────┼────────┘
                                                 │
                                                 ▼
                                    ┌────────────────────┐
                                    │  Ollama AI Model   │
                                    │ (Qwen2.5-Coder)    │
                                    │  Running Locally   │
                                    └─────────┬──────────┘
                                              │
                                              │ AI Analysis
                                              ▼
                                    ┌────────────────────┐
                                    │   AI Response:     │
                                    │ • Summary          │
                                    │ • Improved Code    │
                                    │ • Suggestions      │
                                    └─────────┬──────────┘
                                              │
                                              │ Return JSON
                                              ▼
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌────────────┐    ┌──────────────┐   ┌──────────────┐ │
│  │  Display   │◀───│   Process    │◀──│  Receive     │ │
│  │  Results   │    │   Response   │   │  Response    │ │
│  └────────────┘    └──────────────┘   └──────────────┘ │
│                                                          │
│  Shows: Summary | Original Code | Improved Code | Diff  │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### **Backend (FastAPI + Python)**
```
backend/
├── app/
│   ├── main.py              # 🚀 App entry point
│   ├── routes/
│   │   └── review.py        # 📡 API endpoint: POST /api/review
│   ├── services/
│   │   ├── llm_service.py   # 🤖 Talks to Ollama
│   │   ├── summary_service.py  # 📝 Generates summary
│   │   └── diff_service.py  # 🔄 Creates code diff
│   └── models/
│       └── review_model.py  # 📦 Data structures
└── requirements.txt         # 📚 Python packages
```

**What happens in the backend:**
1. **Receives** your code file via HTTP
2. **Validates** file size and encoding
3. **Sends** code to Ollama AI model
4. **Gets** AI analysis back
5. **Creates** diff between original and improved code
6. **Returns** everything as JSON

### **Frontend (React + Tailwind)**
```
frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx      # 📤 Drag & drop files
│   │   ├── SummaryCard.jsx     # 📋 Shows AI summary
│   │   ├── CodePanel.jsx       # 💻 Code viewer
│   │   ├── DiffPanel.jsx       # 🔍 Side-by-side diff
│   │   ├── SeverityAnalysis.jsx # ⚠️ Issue severity
│   │   ├── DownloadReport.jsx  # 💾 Export PDF/JSON
│   │   └── ReviewHistory.jsx   # 📜 Past reviews
│   ├── hooks/
│   │   └── useCodeReview.js    # 🎣 Main logic hook
│   ├── pages/
│   │   └── Home.jsx            # 🏠 Main page
│   └── api.js                  # 🌐 Backend communication
└── package.json                # 📦 Node packages
```

**What happens in the frontend:**
1. **User uploads** file (drag & drop or browse)
2. **Validates** file type (.py, .js, .java, etc.)
3. **Sends** to backend API
4. **Shows** loading animation
5. **Displays** results beautifully
6. **Saves** to history (localStorage)
7. **Allows** export as PDF/JSON

---

## ⚡ Quick Start

### 1️⃣ Install Ollama
```bash
# Download from: https://ollama.ai
ollama pull qwen2.5-coder:14b
```

### 2️⃣ Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
✅ Backend running at `http://localhost:8000`

### 3️⃣ Start Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```
✅ Frontend running at `http://localhost:3000`

### 4️⃣ Use It!
1. Open `http://localhost:3000`
2. Upload a code file
3. Click "Review Code"
4. Get instant AI feedback! 🎉

---

## 🎨 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Review** | Powered by Ollama's Qwen2.5-Coder model |
| 📊 **Severity Analysis** | Critical, High, Medium, Low issue detection |
| 💾 **Export Reports** | Download as PDF or JSON |
| 📜 **Review History** | Access past reviews anytime |
| 📁 **Multi-File** | Review multiple files at once |
| 🎨 **Beautiful UI** | Modern, responsive design |
| ⚡ **Fast** | Local AI = No API costs, super fast |

---

## 🔧 Tech Stack

**Backend:**
- FastAPI (Python web framework)
- Ollama (Local LLM)
- Pydantic (Data validation)
- httpx (Async HTTP client)

**Frontend:**
- React 18
- Tailwind CSS
- Shadcn UI
- Monaco Editor (VS Code editor)
- jsPDF (PDF generation)

---

## 📸 How It Looks

```
┌─────────────────────────────────────────────────────┐
│  🤖 AI Code Review        [Single/Multi] [History]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│     📤 Drag & Drop Your Code File Here              │
│                                                      │
│         [Browse Files]                               │
│                                                      │
├─────────────────────────────────────────────────────┤
│  📋 Summary                    ⚠️ Severity          │
│  AI found 3 improvements...    🔴 Critical: 0       │
│                                🟠 High: 1           │
│                                🟡 Medium: 2         │
├─────────────────────────────────────────────────────┤
│  💻 Original Code       |  ✨ Improved Code         │
│  [Your code here]       |  [Better version]         │
├─────────────────────────────────────────────────────┤
│  🔍 Diff View                                        │
│  - Old line (red)                                    │
│  + New line (green)                                  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Why This Project?

- ✅ **100% Local** - Your code never leaves your machine
- ✅ **No API Costs** - Uses free, local Ollama
- ✅ **Fast** - No internet latency
- ✅ **Private** - Your code stays private
- ✅ **Customizable** - Modify prompts, add features
- ✅ **Learning Tool** - Great for understanding AI integration

---

## 🤝 Contributing

Want to make it better? PRs welcome!

1. Fork it
2. Create your feature branch
3. Commit changes
4. Push and create a PR

---

## 📝 License

MIT License - Feel free to use for anything!

---

## 👨‍💻 Author

**Shreejit Bhakte**

---

## 🙏 Credits

- **Ollama** - Amazing local LLM platform
- **Shadcn UI** - Beautiful React components
- **FastAPI** - Lightning-fast Python framework

---

**⭐ If you like this project, give it a star!**
