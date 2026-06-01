"use client"

import { useArticle } from "../api/use-article"
import { useUpdateArticle } from "../api/use-update-article"
import { ArticleForm } from "../components/article-form"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import type { ArticleUpdatePayload } from "../api/types"
import { useRouter } from "next/navigation"

export function ArticleEditContainer({ id }: { id: number }) {
  const router = useRouter()
  const { data: article, isLoading, isError, error, refetch } = useArticle(id)
  const { mutate, isPending } = useUpdateArticle()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
        <div className="h-32 w-full rounded-lg bg-muted animate-pulse" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-destructive font-medium">Failed to load article</p>
        <p className="text-sm text-muted-foreground">
          {(error as Error).message}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-xl font-bold">404</p>
        <p className="text-muted-foreground">Article not found</p>
        <Button variant="outline" onClick={() => router.push("/articles")}>
          Back to articles
        </Button>
      </div>
    )
  }

  const handleSave = (
    data: Partial<ArticleUpdatePayload>
  ) => {
    mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/articles")
        },
      }
    )
  }

  return <ArticleForm article={article} onSave={handleSave} isSaving={isPending} />
}
