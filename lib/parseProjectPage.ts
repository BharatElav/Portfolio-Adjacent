import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ProjectPage = {
  title: string
  tag: string
  date?: string
  github?: string
  content: string
}

export function getProjectSlugs(): string[] {
  const dir = path.join(process.cwd(), 'content', 'projects')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).map((file) => file.replace(/\.md$/, ''))
}

export function parseProjectPage(slug: string): ProjectPage {
  const filePath = path.join(process.cwd(), 'content', 'projects', `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    title: data.title,
    tag: data.tag,
    date: data.date,
    github: data.github,
    content,
  }
}