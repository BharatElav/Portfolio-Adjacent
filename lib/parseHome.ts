import fs from 'fs'
import path from 'path'

export type Highlight = {
  media: string
  mediaType: 'video' | 'image'
  side: 'left' | 'right'
  content: string
}

export function parseHome(): Highlight[] {
  const filePath = path.join(process.cwd(), 'content', 'home.md')
  const raw = fs.readFileSync(filePath, 'utf-8')

  const blocks = raw
    .split('---highlight---')
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
      const [key, ...rest] = line.split(':')
      meta[key.trim()] = rest.join(':').trim()
    }

    const content = lines.slice(contentStart).join('\n').trim()

    return {
      media: meta.media,
      mediaType: meta.mediaType as 'video' | 'image',
      side: meta.side as 'left' | 'right',
      content,
    }
  })
}