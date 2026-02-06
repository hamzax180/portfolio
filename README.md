# Hamza Al-Ahdal Portfolio 🚀

Modern AI-powered portfolio website featuring a responsive design and an interactive Gemini-powered chatbot with voice capabilities.

## � Project Structure

- **`frontend/`**: The client-side application (HTML, CSS, JS).
- **`backend/`**: Node.js Express server that proxies API requests to Gemini (keeps your API key safe).
- **`infra/`**: Docker and Kubernetes configuration files.
- **`assets/`**: High-quality downloadable assets (e.g., CV PDF).

## 🚀 Getting Started

### 1. Set up the Environment
Create a `.env` file inside the **`backend/`** folder:
```env
GEMINI_API_KEY=your_actual_key_here
PORT=3000
```

### 2. Run the Backend Proxy
```bash
cd backend
npm install
node server.js
```

### 3. Serve the Frontend
You can use any static server. For example:
```bash
npx serve frontend
```
Access at: `http://localhost:3000` (or whatever port `serve` uses).

## 🐳 Docker Setup

To run the portfolio in a container:

1. **Build the image** (from the root):
   ```bash
   docker build -f infra/Dockerfile -t portfolio-app .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 8080:80 --name portfolio portfolio-app
   ```

## ☸️ Kubernetes (Local)

Deploy using the manifests in the `infra/` folder:
```bash
kubectl apply -f infra/k8s-deployment.yaml
kubectl apply -f infra/k8s-service.yaml
```

## 🔐 Security

The Gemini API key is now **hidden** from the user. The frontend talks to your local `backend/server.js`, which then talks to Google using the key stored in `.env`.
