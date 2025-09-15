import axios from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Don't override Content-Type if it's FormData
    // Axios will automatically set the correct multipart/form-data header
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log("error ", error)

    if (error.response?.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
