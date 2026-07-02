import fs from 'fs'
import path from 'path'

export type Course = {
  name: string
  category: string
  description: string
}

export function parseCourses(): Course[] {
  const filePath = path.join(process.cwd(), 'content', 'courses.md')
  const raw = fs.readFileSync(filePath, 'utf-8')

  const blocks = raw
    .split('---course---')
    .map((block: string) => block.trim())
    .filter((block: string) => block.length > 0)

  return blocks.map((block: string) => {
    const lines = block.split('\n')
    const meta: Record<string, string> = {}
    let contentStart = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '') {
        contentStart = i + 1
        break
      }
      const [key, ...rest] = lines[i].split(':')
      meta[key.trim()] = rest.join(':').trim()
    }

    const description = lines.slice(contentStart).join('\n').trim()

    return {
      name: meta.name,
      category: meta.category,
      description,
    }
  })
}