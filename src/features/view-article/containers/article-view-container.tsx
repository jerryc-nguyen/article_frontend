"use client"

import { useArticle } from "@/features/article-management/api/use-article"
import { ArticleView } from "../components/article-view"
import { Button } from "@/components/ui/button"
import { RotateCw, FileText, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

function LoadingSkeleton() {
  return (
    <div className="max-w-[70ch] mx-auto space-y-8">
      <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
      <div className="h-4 w-64 rounded-lg bg-muted animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 w-32 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="rounded-full bg-destructive/10 p-3">
        <FileText className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-destructive font-medium">Failed to load article</p>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {error.message}
      </p>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RotateCw className="h-4 w-4" /> Retry
      </Button>
    </div>
  )
}

function NotFoundState() {
  const router = useRouter()
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

export function ArticleViewContainer({ id }: { id: number }) {
  const { data: article, isLoading, isError, error, refetch } = useArticle(id)

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState error={error as Error} onRetry={refetch} />
  if (!article) return <NotFoundState />

  return <ArticleView article={article} />
}
