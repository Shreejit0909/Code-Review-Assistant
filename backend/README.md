# Code Review Assistant - Backend API

## 📋 Overview

The **Code Review Assistant** is an AI-powered automated code review system built with **FastAPI**. It leverages the **Ollama local LLM** (qwen2.5-coder:14b) to analyze code files, generate summaries, suggest improvements, and produce GitHub-style diffs.

### Key Features

- 🤖 **AI-Powered Analysis**: Uses Ollama's qwen2.5-coder:14b model for intelligent code review
- 📝 **Code Summaries**: Generates concise 3-4 line summaries of code functionality
- ✨ **Code Improvements**: Suggests better formatting, structure, and documentation without changing logic
- 🔄 **Diff Generation**: Creates unified diffs showing all improvements
- 🚀 **Async Architecture**: Fully asynchronous for optimal performance
- 🔒 **Type Safety**: Uses Pydantic models for request/response validation
- 📊 **Clean Architecture**: Follows professional separation of concerns

---

## 🏗️ Project Structure

```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py              # Configuration management
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   └── review.py              # Code review API endpoints
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── llm_service.py         # Ollama LLM integration
│   │   ├── summary_service.py     # Summary generation
│   │   └── diff_service.py        # Diff generation
│   │
│   └── models/
│       ├── __init__.py
│       └── review_model.py        # Pydantic models
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

1. **Python 3.9+** installed
2. **Ollama** installed and running locally
3. **qwen2.5-coder:14b** model pulled in Ollama

### Install Ollama and Model

```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai/download

# Pull the required model
ollama pull qwen2.5-coder:14b

# Verify Ollama is running
ollama list
```

### Installation Steps

1. **Clone or navigate to the project directory**

```bash
cd "d:\Company Projects\Code Review\code-review-assistant\backend"
```

2. **Create a virtual environment**

```bash
python -m venv venv
```

3. **Activate the virtual environment**

```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies**

```bash
pip install -r requirements.txt
```

5. **Set up environment variables**

```bash
# Copy the example env file
cp .env.example .env

# Edit .env if needed (default values should work for local Ollama)
```

6. **Run the application**

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the main.py directly
python -m app.main
```

7. **Verify the API is running**

Open your browser and navigate to:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 📡 API Endpoints

### 1. **POST /api/review**

Upload a code file for AI-powered review.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: File upload (any text-based code file)

**Response:**
```json
{
  "summary": "3-4 line summary of the code",
  "original_code": "Original uploaded code",
  "improved_code": "AI-improved version with better structure",
  "diff": "Unified diff showing changes",
  "filename": "example.py"
}
```

**Example using cURL:**

```bash
curl -X POST "http://localhost:8000/api/review" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@example.py"
```

**Example using Python requests:**

```python
import requests

url = "http://localhost:8000/api/review"
files = {"file": open("example.py", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

### 2. **GET /health**

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "ollama_url": "http://localhost:11434/api/generate",
  "model": "qwen2.5-coder:14b"
}
```

### 3. **GET /api/review/health**

Check review service health.

**Response:**
```json
{
  "status": "healthy",
  "service": "code-review",
  "llm_configured": true,
  "ollama_url": "http://localhost:11434/api/generate",
  "model": "qwen2.5-coder:14b"
}
```

---

## 🔧 Configuration

All configuration is managed through environment variables in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_URL` | Ollama API endpoint | `http://localhost:11434/api/generate` |
| `MODEL_NAME` | Ollama model to use | `qwen2.5-coder:14b` |
| `MAX_FILE_SIZE` | Maximum upload size (bytes) | `5242880` (5MB) |
| `REQUEST_TIMEOUT` | LLM request timeout (seconds) | `120` |

---

## 🧠 LLM Integration Details

### Ollama Configuration

- **Model**: qwen2.5-coder:14b
- **Endpoint**: http://localhost:11434/api/generate
- **Mode**: Non-streaming for complete responses
- **Timeout**: 120 seconds (configurable)

### Prompt Engineering

The system uses carefully crafted prompts to prevent hallucinations:

1. **Summary Prompt**: Strictly limits output to 3-4 lines
2. **Improvement Prompt**: Explicitly forbids logic changes, only allows:
   - Better formatting
   - Improved naming
   - Added documentation
   - Enhanced structure

### Error Handling

- HTTP timeouts are caught and reported
- JSON parsing errors are handled gracefully
- LLM failures return original code as fallback
- All errors are logged for debugging

---

## 🧪 Testing the API

### Using FastAPI Docs (Recommended)

1. Navigate to http://localhost:8000/docs
2. Click on the `/api/review` endpoint
3. Click "Try it out"
4. Upload a code file
5. Click "Execute"

### Using Postman

1. Create a new POST request to `http://localhost:8000/api/review`
2. Go to Body → form-data
3. Add key: `file`, type: File
4. Select a code file
5. Send the request

---

## 📦 Dependencies

- **fastapi**: Modern web framework for building APIs
- **uvicorn**: ASGI server for running FastAPI
- **httpx**: Async HTTP client for Ollama API calls
- **python-multipart**: File upload support
- **pydantic**: Data validation and settings management
- **pydantic-settings**: Environment variable management
- **python-dotenv**: Load environment variables from .env

---

## 🔒 Security Considerations

- File size limits prevent DoS attacks
- UTF-8 encoding validation prevents binary file exploits
- CORS is configured (update for production)
- No sensitive data is logged
- Environment variables keep secrets secure

---

## 🚀 Production Deployment

### Recommendations

1. **Update CORS settings** in `app/main.py` to specific frontend URL
2. **Use environment-specific .env files**
3. **Set up proper logging** (file-based, log rotation)
4. **Use a process manager** like systemd or supervisor
5. **Deploy behind a reverse proxy** (nginx, traefik)
6. **Enable HTTPS** with SSL certificates
7. **Set up monitoring** and health checks

### Example Production Run

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🐛 Troubleshooting

### Ollama Connection Issues

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama service
ollama serve
```

### Import Errors

```bash
# Ensure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```

---

## 📝 License

This project is part of the Code Review Assistant system.

---

## 👥 Contributing

This is a production-ready backend. Future enhancements:
- Add authentication/authorization
- Implement rate limiting
- Add caching for repeated reviews
- Support multiple LLM providers
- Add code quality metrics

---

## 📧 Support

For issues or questions, please check:
1. Ollama is running: `ollama list`
2. Model is available: `ollama pull qwen2.5-coder:14b`
3. Environment variables are set correctly
4. API docs: http://localhost:8000/docs

---

**Built with ❤️ using FastAPI and Ollama**
