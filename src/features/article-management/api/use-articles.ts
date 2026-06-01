import { useQuery } from "@tanstack/react-query"
import { getArticles } from "./article-service"

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  })
}
