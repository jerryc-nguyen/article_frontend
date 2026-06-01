import { Badge } from "@/components/ui/badge"
import type { ArticleStatus } from "../api/types"

const statusStyles: Record<ArticleStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  reviewed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  published: "bg-green-100 text-green-800 hover:bg-green-100",
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>
}
