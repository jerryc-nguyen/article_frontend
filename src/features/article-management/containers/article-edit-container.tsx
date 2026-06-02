"use client"

import { useArticle } from "../api/use-article"
import { useUpdateArticle } from "../api/use-update-article"
import { ArticleForm } from "../components/article-form"
import { Button } from "@/components/ui/button"
import { RotateCw, FileText, ArrowLeft } from "lucide-react"
import type { ArticleUpdatePayload } from "../api/types"
import { useRouter } from "next/navigation"

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded-lg bg-muted animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border">
          <div className="border-b px-6 py-3">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
            <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ArticleEditContainer({ id }: { id: number }) {
  const router = useRouter()
  const { data: article, isLoading, isError, error, refetch } = useArticle(id)
  const { mutate, isPending } = useUpdateArticle()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="rounded-full bg-destructive/10 p-3">
          <FileText className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-destructive font-medium">Failed to load article</p>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {(error as Error).message}
        </p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RotateCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="rounded-full bg-muted p-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-xl font-bold tracking-tight">404</p>
        <p className="text-muted-foreground">Article not found</p>
        <Button variant="outline" onClick={() => router.push("/articles")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to articles
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
