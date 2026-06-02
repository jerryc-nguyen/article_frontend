"use client"

import { useState, useEffect, useCallback } from "react"
import type { Article } from "@/features/article-management/api/types"
import { StatusBadge } from "@/features/article-management/components/status-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, XCircle, Shield } from "lucide-react"

interface ArticleViewProps {
  article: Article
}

interface TocItem {
  id: string
  label: string
}

export function ArticleView({ article }: ArticleViewProps) {
  const tocItems: TocItem[] = [
    { id: "overview", label: "Overview" },
    ...article.main_article_body.map((section, i) => ({
      id: `section-${i}`,
      label: section.heading || `Section ${i + 1}`,
    })),
    { id: "audience", label: "Best For / Not For" },
    { id: "key-facts", label: "Key Facts" },
    { id: "ethics", label: "Ethics & Safety" },
  ]

  const sectionIds = tocItems.map((item) => item.id)
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const renderContent = (text: string) =>
    text.split("\n\n").map((paragraph, i) => (
      <p key={i} className="mb-4 leading-relaxed text-foreground/90">
        {paragraph}
      </p>
    ))

  return (
    <div>
      {/* Mobile section nav */}
      <div className="lg:hidden mb-8">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
          Jump to section
        </label>
        <Select onValueChange={scrollToSection as (value: string | null) => void}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {tocItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Desktop sidebar TOC */}
        <nav className="hidden lg:block sticky top-8 self-start">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            On this page
          </h3>
          <div className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <article>
          {/* Title hero */}
          <header id="overview" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={article.status} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            {article.intro_hook && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-[70ch]">
                {article.intro_hook}
              </p>
            )}
          </header>

          {/* Body sections */}
          <div className="space-y-10 mb-12">
            {article.main_article_body.map((section, i) => (
              <section
                key={i}
                id={`section-${i}`}
                className="scroll-mt-20 max-w-[70ch]"
              >
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                  {section.heading}
                </h2>
                <div className="text-base leading-7">
                  {renderContent(section.content)}
                </div>
              </section>
            ))}
          </div>

          {/* Best For / Not For */}
          <section id="audience" className="scroll-mt-20 mb-12 max-w-[70ch]">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
              Who is this for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Best For
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.best_for}
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-red-700 dark:text-red-400">
                    Not For
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.not_for}
                </p>
              </div>
            </div>
          </section>

          {/* Key Facts */}
          {article.key_facts.length > 0 && (
            <section id="key-facts" className="scroll-mt-20 mb-12 max-w-[70ch]">
              <h2 className="text-2xl font-semibold tracking-tight mb-6">
                Key Facts
              </h2>
              <div className="rounded-xl border divide-y">
                {article.key_facts.map((fact, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[140px_1fr] gap-4 px-6 py-3 text-sm"
                  >
                    <span className="font-medium text-muted-foreground">
                      {fact.label}
                    </span>
                    <span>{fact.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ethics & Safety */}
          {article.ethics_safety_notes && (
            <section id="ethics" className="scroll-mt-20 mb-12 max-w-[70ch]">
              <div className="rounded-xl border bg-muted/50 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
                  <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Ethics & Safety Notes
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.ethics_safety_notes}
                </p>
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  )
}
