import { Marked } from 'marked'

export interface MarkdownHeading {
  level: 1 | 2
  text: string
  id: string
}

export interface MarkdownRenderResult {
  html: string
  headings: MarkdownHeading[]
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

function createSlug(text: string, slugCounts: Map<string, number>): string {
  const base = slugify(text)
  const count = slugCounts.get(base) ?? 0
  slugCounts.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

/**
 * 将 Markdown 正文渲染为 HTML，并提取一、二级标题用于目录
 */
export function renderMarkdown(content: string): MarkdownRenderResult {
  if (!content)
    return { html: '', headings: [] }

  const headings: MarkdownHeading[] = []
  const slugCounts = new Map<string, number>()

  const marked = new Marked({
    gfm: true,
    breaks: true,
  })

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens)
        const plainText = tokens
          .map((token) => ('text' in token ? String(token.text) : ''))
          .join('')
          .trim()

        if (depth === 1 || depth === 2) {
          const id = createSlug(plainText || text.replace(/<[^>]+>/g, ''), slugCounts)
          headings.push({ level: depth, text: plainText || text.replace(/<[^>]+>/g, ''), id })
          return `<h${depth} id="${id}">${text}</h${depth}>\n`
        }

        return `<h${depth}>${text}</h${depth}>\n`
      },
    },
  })

  const html = marked.parse(content, { async: false }) as string
  return { html, headings }
}
