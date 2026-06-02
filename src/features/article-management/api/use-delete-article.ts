import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteArticle } from "./article-service"

export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
    },
  })
}
