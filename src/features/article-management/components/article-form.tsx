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
import { Plus, Trash2 } from "lucide-react"

interface ArticleFormProps {
  article: Article
  onSave: (data: Partial<ArticleUpdatePayload>) => void
  isSaving: boolean
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
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Article</h1>
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
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Intro / Hook</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
          value={introHook}
          onChange={(e) => setIntroHook(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Article Body</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setBodySections([...bodySections, { heading: "", content: "" }])
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </Button>
        </div>
        {bodySections.map((section, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Section {i + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setBodySections(bodySections.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="Heading"
              value={section.heading}
              onChange={(e) => {
                const next = [...bodySections]
                next[i] = { ...next[i], heading: e.target.value }
                setBodySections(next)
              }}
            />
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              placeholder="Content"
              value={section.content}
              onChange={(e) => {
                const next = [...bodySections]
                next[i] = { ...next[i], content: e.target.value }
                setBodySections(next)
              }}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Best For</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
          value={bestFor}
          onChange={(e) => setBestFor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Not For</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
          value={notFor}
          onChange={(e) => setNotFor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ethics / Safety Notes</label>
        <textarea
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
          value={ethicsNotes}
          onChange={(e) => setEthicsNotes(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Key Facts</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setKeyFacts([...keyFacts, { label: "", value: "" }])}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Fact
          </Button>
        </div>
        {keyFacts.map((fact, i) => (
          <div key={i} className="flex gap-3 items-start">
            <input
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="Label"
              value={fact.label}
              onChange={(e) => {
                const next = [...keyFacts]
                next[i] = { ...next[i], label: e.target.value }
                setKeyFacts(next)
              }}
            />
            <input
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
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
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </form>
  )
}
