import { parseProjectPage, getProjectSlugs } from '@/lib/parseProjectPage'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = parseProjectPage(slug)

  return (
    <main className="min-h-screen pt-32 pb-16 bg-[var(--background)] flex justify-center">
      <div className="w-full max-w-2xl px-4 md:px-8">
        <span className="text-xs uppercase tracking-wide text-gray-400">{project.tag}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-8 text-black dark:text-white">{project.title}</h1>
        <article className="flex flex-col gap-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-2 text-black dark:text-white">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-2 text-black dark:text-white">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold mt-6 mb-1 text-black dark:text-white">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-black dark:text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside flex flex-col gap-1 text-gray-700 dark:text-gray-300">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside flex flex-col gap-1 text-gray-700 dark:text-gray-300">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed">{children}</li>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-black dark:text-white hover:opacity-60 transition-opacity">{children}</a>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt ?? ''} className="w-full rounded-lg my-6" />
              ),
              hr: () => (
                <hr className="border-black/10 dark:border-white/10 my-8" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-black dark:border-white pl-4 italic text-gray-600 dark:text-gray-400 my-4">{children}</blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-black dark:text-white">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-black/5 dark:bg-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono my-4">{children}</pre>
              ),
            }}
          >
            {project.content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  )
}