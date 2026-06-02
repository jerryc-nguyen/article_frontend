import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-8 text-center px-4">
        <div className="flex items-center gap-3">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">ArticleApp</h1>
        </div>
        <p className="max-w-md text-lg text-muted-foreground">
          Create, manage, and publish your articles with ease.
          Upload documents and generate structured content in minutes.
        </p>
        <Link href="/articles">
          <Button size="lg" className="gap-2">
            Browse Articles <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
