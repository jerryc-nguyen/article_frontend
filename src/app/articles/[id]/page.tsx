import { Breadcrumbs } from "@/components/breadcrumbs"
import { ArticleEditContainer } from "@/features/article-management/containers/article-edit-container"

export const metadata = {
  title: "Edit Article - ArticleApp",
}

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="min-h-full">
      <div className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Breadcrumbs
            items={[
              { label: "Articles", href: "/articles" },
              { label: "Edit" },
            ]}
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <ArticleEditContainer id={Number(id)} />
      </div>
    </div>
  )
}
