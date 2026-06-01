export interface ArticleSection {
  heading: string
  content: string
}

export interface KeyFact {
  label: string
  value: string
}

export type ArticleStatus = "draft" | "reviewed" | "published"

export interface Article {
  id: number
  status: ArticleStatus
  title: string
  intro_hook: string
  main_article_body: ArticleSection[]
  best_for: string
  not_for: string
  ethics_safety_notes: string
  key_facts: KeyFact[]
  original_content: string
}
