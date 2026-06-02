import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import type { Article } from "../api/types"
import { Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticleTableProps {
  articles: Article[]
  onDelete: (id: number) => void
}

export function ArticleTable({ articles, onDelete }: ArticleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>
              <Link
                href={`/articles/${article.id}`}
                className="font-medium hover:underline"
              >
                {article.title}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge status={article.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">—</TableCell>
            <TableCell className="text-muted-foreground">—</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Link href={`/articles/${article.id}/view`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${article.title}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(article.id)}
                  aria-label={`Delete ${article.title}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
