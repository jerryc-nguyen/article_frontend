import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set")
}

function getToken(): string | null {
  const match = document.cookie.match("(?:^|;\\s*)access_token=([^;]*)")
  return match ? decodeURIComponent(match[1]) : null
}

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.error || error.message || `Request failed with status ${error.response?.status}`
    return Promise.reject(new Error(message))
  }
)

export const api = {
  get: <T>(path: string) => instance.get<T>(path).then((r) => r.data),
  post: <T>(path: string, body: unknown) => instance.post<T>(path, body).then((r) => r.data),
  put: <T>(path: string, body: unknown) => instance.put<T>(path, body).then((r) => r.data),
  patch: <T>(path: string, body: unknown) => instance.patch<T>(path, body).then((r) => r.data),
  delete: <T>(path: string) => instance.delete<T>(path).then((r) => r.data),
}
