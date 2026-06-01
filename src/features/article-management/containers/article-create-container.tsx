"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import mammoth from "mammoth"
import { useCreateArticle } from "../api/use-create-article"
import { ArticleUpload } from "../components/article-upload"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ArticleCreateContainer() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync: createArticle } = useCreateArticle()

  const handleSubmit = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const article = await createArticle(result.value)
      router.push(`/articles/${article.id}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create New Article</h1>
      <ArticleUpload
        onFileSelect={(f) => {
          setFile(f)
          setError(null)
        }}
        disabled={isProcessing}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        onClick={handleSubmit}
        disabled={!file || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Upload & Generate Article"
        )}
      </Button>
    </div>
  )
}
