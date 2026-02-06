# Hamza Al-Ahdal Portfolio 🚀

Modern AI-powered portfolio website featuring a responsive design and an interactive Gemini-powered chatbot with voice capabilities.

## � Project Structure

- **`frontend/`**: The client-side application (HTML, CSS, JS).
- **`backend/`**: Node.js Express server that proxies API requests to Gemini (keeps your API key safe).
- **`infra/`**: Docker and Kubernetes configuration files.
- **`assets/`**: High-quality downloadable assets (e.g., CV PDF).

## 🏗️ Architecture

The application is built using a modern, containerized architecture that separates concerns for security and scalability.

```mermaid
graph TD
    User([User's Browser])
    
    subgraph "Local Dev / Kubernetes"
        FE[Frontend Container - Nginx]
        BE[Backend Proxy - Node.js]
        ENV[.env Secret]
    end
    
    Gemini[Google Gemini API]
    
    User --> FE
    FE --> BE
    BE --> ENV
    BE --> Gemini
```

### Component Details:
- **Frontend**: A lightweight Nginx container serving static assets from the `frontend/` directory.
- **Backend Proxy**: A Node.js Express server that handles AI requests to keep the `GEMINI_API_KEY` hidden from the client browser.
- **Infrastructure**: Dockerized services orchestrated by Kubernetes for local development consistency.


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
