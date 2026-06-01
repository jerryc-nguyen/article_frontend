import { useQuery } from "@tanstack/react-query"
import { getArticle } from "./article-service"

export function useArticle(id: number) {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => getArticle(id),
    enabled: !!id,
  })
}
