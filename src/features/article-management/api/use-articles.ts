import { useQuery } from "@tanstack/react-query"
import { getArticles } from "./article-service"

export function useArticles(status?: string) {
  return useQuery({
    queryKey: status ? ["articles", "filter", status] : ["articles"],
    queryFn: () => getArticles(status),
  })
}
