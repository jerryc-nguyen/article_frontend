import type { Article } from "./types"
import { mockArticles } from "./mock-data"

let articles = [...mockArticles]

export async function getArticles(): Promise<Article[]> {
  return [...articles]
}

export async function getArticle(id: number): Promise<Article | undefined> {
  return articles.find((a) => a.id === id)
}

export async function updateArticle(
  id: number,
  data: Partial<Omit<Article, "id" | "original_content">>
): Promise<Article | undefined> {
  const index = articles.findIndex((a) => a.id === id)
  if (index === -1) return undefined

  articles[index] = { ...articles[index], ...data }
  return articles[index]
}
