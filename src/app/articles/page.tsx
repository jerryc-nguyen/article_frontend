import { Breadcrumbs } from "@/components/breadcrumbs"
import { ArticleListContainer } from "@/features/article-management/containers/article-list-container"

export default function ArticlesPage() {
  return (
    <div className="p-6">
      <Breadcrumbs items={[{ label: "Articles" }]} />
      <ArticleListContainer />
    </div>
  )
}
