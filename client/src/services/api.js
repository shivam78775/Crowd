import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "";
console.log("Raw VITE_API_BASE_URL:", rawBaseURL);

// Ensure the URL ends with /api/
let finalBaseURL = rawBaseURL;
if (finalBaseURL && !finalBaseURL.includes("/api")) {
  finalBaseURL = finalBaseURL.endsWith("/") ? `${finalBaseURL}api/` : `${finalBaseURL}/api/`;
} else if (finalBaseURL && !finalBaseURL.endsWith("/")) {
  finalBaseURL = `${finalBaseURL}/`;
}

console.log("Resolved Axios Base URL:", finalBaseURL);

const api = axios.create({
  baseURL: finalBaseURL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("fundify_auth");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

