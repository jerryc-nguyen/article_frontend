import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateArticleStatus } from "./article-service"

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: string
    }) => updateArticleStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      queryClient.invalidateQueries({ queryKey: ["articles", id] })
    },
  })
}
