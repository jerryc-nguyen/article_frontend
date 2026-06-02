import { ROUTES } from "@/commons/api/routes"
import type { Article, ArticleUpdatePayload } from "./types"
import { api } from "./client"

export async function getArticles(status?: string): Promise<Article[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : ""
  return api.get<Article[]>(`${ROUTES.ARTICLE.LIST}${query}`)
}

export async function getArticle(id: number): Promise<Article> {
  return api.get<Article>(ROUTES.ARTICLE.BY_ID(id))
}

export async function createArticle(
  originalContent: string
): Promise<Article> {
  return api.post<Article>(ROUTES.AI.PARSE, {
    original_content: originalContent,
  })
}

export async function updateArticle(
  id: number,
  data: Partial<ArticleUpdatePayload>
): Promise<Article> {
  return api.put<Article>(ROUTES.ARTICLE.BY_ID(id), data)
}

export async function updateArticleStatus(
  id: number,
  status: string
): Promise<Article> {
  return api.patch<Article>(ROUTES.ARTICLE.STATUS(id), { status })
}

export async function deleteArticle(id: number): Promise<void> {
  await api.delete<void>(ROUTES.ARTICLE.BY_ID(id))
}
