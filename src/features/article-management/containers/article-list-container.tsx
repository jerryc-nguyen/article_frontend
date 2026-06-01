"use client"

import { useArticles } from "../api/use-articles"
import { ArticleTable } from "../components/article-table"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"

export function ArticleListContainer() {
  const { data: articles, isLoading, isError, error, refetch } = useArticles()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-destructive font-medium">Failed to load articles</p>
        <p className="text-sm text-muted-foreground">
          {(error as Error).message}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-muted-foreground">No articles yet.</p>
      </div>
    )
  }

  return <ArticleTable articles={articles} />
}
