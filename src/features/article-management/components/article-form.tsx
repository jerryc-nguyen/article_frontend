"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Article, ArticleStatus, ArticleUpdatePayload } from "../api/types"
import {
  Plus,
  Trash2,
  FileText,
  AlignLeft,
  BookOpen,
  Shield,
  GripVertical,
} from "lucide-react"

interface ArticleFormProps {
  article: Article
  onSave: (data: Partial<ArticleUpdatePayload>) => void
  isSaving: boolean
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof FileText
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b px-6 py-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">
        {children}
      </div>
    </section>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </label>
  )
}

export function ArticleForm({ article, onSave, isSaving }: ArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [introHook, setIntroHook] = useState(article.intro_hook)
  const [bodySections, setBodySections] = useState(article.main_article_body)
  const [bestFor, setBestFor] = useState(article.best_for)
  const [notFor, setNotFor] = useState(article.not_for)
  const [ethicsNotes, setEthicsNotes] = useState(article.ethics_safety_notes)
  const [keyFacts, setKeyFacts] = useState(article.key_facts)
  const [status, setStatus] = useState<ArticleStatus>(article.status)

  useEffect(() => {
    setTitle(article.title)
    setIntroHook(article.intro_hook)
    setBodySections(article.main_article_body)
    setBestFor(article.best_for)
    setNotFor(article.not_for)
    setEthicsNotes(article.ethics_safety_notes)
    setKeyFacts(article.key_facts)
    setStatus(article.status)
  }, [article])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      intro_hook: introHook,
      main_article_body: bodySections,
      best_for: bestFor,
      not_for: notFor,
      ethics_safety_notes: ethicsNotes,
      key_facts: keyFacts,
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update the article content and metadata
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ArticleStatus)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isSaving} className="min-w-24">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <SectionCard title="Basic Information" icon={FileText}>
        <div className="space-y-2">
          <FieldLabel>Title</FieldLabel>
          <input
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Intro / Hook</FieldLabel>
          <textarea
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[100px] placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            value={introHook}
            onChange={(e) => setIntroHook(e.target.value)}
          />
        </div>
      </SectionCard>

      {/* Article Body */}
      <SectionCard title="Article Body" icon={AlignLeft}>
        <div className="space-y-4">
          {bodySections.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sections yet. Add one to get started.
            </p>
          )}
          {bodySections.map((section, i) => (
            <div
              key={i}
              className="rounded-lg border bg-muted/30 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GripVertical className="h-3.5 w-3.5" />
                  Section {i + 1}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setBodySections(bodySections.filter((_, j) => j !== i))
                  }
                  className="h-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <input
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium"
                placeholder="Section heading"
                value={section.heading}
                onChange={(e) => {
                  const next = [...bodySections]
                  next[i] = { ...next[i], heading: e.target.value }
                  setBodySections(next)
                }}
              />
              <textarea
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[100px] placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="Write your section content here..."
                value={section.content}
                onChange={(e) => {
                  const next = [...bodySections]
                  next[i] = { ...next[i], content: e.target.value }
                  setBodySections(next)
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setBodySections([...bodySections, { heading: "", content: "" }])
            }
            className="w-full border-dashed gap-2"
          >
            <Plus className="h-4 w-4" /> Add Section
          </Button>
        </div>
      </SectionCard>

      {/* Audience */}
      <SectionCard title="Audience" icon={BookOpen}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel>Best For</FieldLabel>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[100px] placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              value={bestFor}
              onChange={(e) => setBestFor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Not For</FieldLabel>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[100px] placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              value={notFor}
              onChange={(e) => setNotFor(e.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Metadata */}
      <SectionCard title="Metadata" icon={Shield}>
        <div className="space-y-2">
          <FieldLabel>Ethics / Safety Notes</FieldLabel>
          <textarea
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm min-h-[80px] placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            value={ethicsNotes}
            onChange={(e) => setEthicsNotes(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Key Facts</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setKeyFacts([...keyFacts, { label: "", value: "" }])}
              className="gap-1.5 h-7 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Fact
            </Button>
          </div>
          {keyFacts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No key facts added yet.
            </p>
          )}
          {keyFacts.map((fact, i) => (
            <div key={i} className="flex gap-3 items-start">
              <input
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Label"
                value={fact.label}
                onChange={(e) => {
                  const next = [...keyFacts]
                  next[i] = { ...next[i], label: e.target.value }
                  setKeyFacts(next)
                }}
              />
              <input
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Value"
                value={fact.value}
                onChange={(e) => {
                  const next = [...keyFacts]
                  next[i] = { ...next[i], value: e.target.value }
                  setKeyFacts(next)
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setKeyFacts(keyFacts.filter((_, j) => j !== i))}
                className="h-10 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Changes are saved when you click Save Changes
        </p>
        <Button type="submit" disabled={isSaving} className="min-w-24">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
