import { useMutation } from "@tanstack/react-query"
import { createArticle } from "./article-service"

export function useCreateArticle() {
  return useMutation({
    mutationFn: createArticle,
  })
}
