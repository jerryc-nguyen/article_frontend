export const ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
  },
  ARTICLE: {
    LIST: "/api/v1/article_management",
    BY_ID: (id: number) => `/api/v1/article_management/${id}`,
    STATUS: (id: number) => `/api/v1/article_management/${id}/status`,
  },
  AI: {
    PARSE: "/api/v2/article_ai_parser",
  },
} as const
