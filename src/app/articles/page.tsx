import { ArticleListContainer } from "@/features/article-management/containers/article-list-container"

export default function ArticlesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Articles</h1>
      <ArticleListContainer />
    </div>
  )
}
