import { ArticleEditContainer } from "@/features/article-management/containers/article-edit-container"

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="p-6">
      <ArticleEditContainer id={Number(id)} />
    </div>
  )
}
