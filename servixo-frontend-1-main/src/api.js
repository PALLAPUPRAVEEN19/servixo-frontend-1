import axios from "axios";

const api = axios.create({
  baseURL: "https://servixo-backend-1-deployment.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // JWT token is strictly stored in sessionStorage per requirements
    const token = sessionStorage.getItem("token");
    const requestUrl = config.url || "";
    
    // Check if it's an authentication route where a token shouldn't be mandatory
    const isAuthRequest = requestUrl.includes("auth/") || requestUrl.includes("login") || requestUrl.includes("register");

    // Check if token exists; if not and it's not an auth request, redirect to /login
    if (!token && !isAuthRequest) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = "/login";
      }
      return Promise.reject(new Error('No token found'));
    }

    // Always attach token
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        // Aggressively clear both storages
        sessionStorage.clear();
        localStorage.clear();
        
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
      } else if (status === 403) {
        // Return structured promise rejecting access denied
        return Promise.reject(new Error("Access denied"));
      } else if (status >= 500) {
        // Safe backend error extraction (DO NOT crash UI)
        const errMsg = error.response.data?.message || "Internal server error";
        return Promise.reject(new Error(errMsg));
      }
    } else {
       // No response logic
       return Promise.reject(new Error("Server unreachable"));
    }

    return Promise.reject(error);
  }
);

export default api;