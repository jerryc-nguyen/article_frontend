import { Breadcrumbs } from "@/components/breadcrumbs"
import { CreatePage } from "@/features/article-management/pages/create-page"

export default function ArticleNewPage() {
  return (
    <div className="p-6">
      <Breadcrumbs items={[{ label: "Articles", href: "/articles" }, { label: "New" }]} />
      <CreatePage />
    </div>
  )
}
