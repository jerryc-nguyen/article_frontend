import type { Article, ArticleUpdatePayload } from "./types"
import { api } from "./client"

export async function getArticles(status?: string): Promise<Article[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : ""
  return api.get<Article[]>(`/article_management${query}`)
}

export async function getArticle(id: number): Promise<Article> {
  return api.get<Article>(`/article_management/${id}`)
}

export async function createArticle(
  originalContent: string
): Promise<Article> {
  return api.post<Article>("/article_ai_parser", {
    original_content: originalContent,
  })
}

export async function updateArticle(
  id: number,
  data: Partial<ArticleUpdatePayload>
): Promise<Article> {
  return api.put<Article>(`/article_management/${id}`, data)
}

export async function updateArticleStatus(
  id: number,
  status: string
): Promise<Article> {
  return api.patch<Article>(`/article_management/${id}/status`, { status })
}
