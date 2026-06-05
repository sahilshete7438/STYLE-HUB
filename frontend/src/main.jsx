import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Global Axios Interceptor to dynamically rewrite localhost:8080 URLs to the live production server in cloud hosting
const liveApiUrl = import.meta.env.VITE_API_URL;
if (liveApiUrl) {
  axios.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith('http://localhost:8080')) {
      config.url = config.url.replace('http://localhost:8080', liveApiUrl);
    }
    return config;
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
