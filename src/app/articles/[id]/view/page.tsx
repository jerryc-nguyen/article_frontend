import { Breadcrumbs } from "@/components/breadcrumbs"
import { ArticleViewContainer } from "@/features/view-article/containers/article-view-container"

export const metadata = {
  title: "View Article - ArticleApp",
}

export default async function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="min-h-full">
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Breadcrumbs
            items={[
              { label: "Articles", href: "/articles" },
              { label: "View" },
            ]}
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <ArticleViewContainer id={Number(id)} />
      </div>
    </div>
  )
}
