import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateArticle } from "./article-service"
import type { Article } from "./types"

export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Article, "id" | "original_content">>
    }) => updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", id] })
    },
  })
}
