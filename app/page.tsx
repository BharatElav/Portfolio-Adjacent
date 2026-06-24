import { parseHome } from '@/lib/parseHome'
import HighlightBlock from '@/app/components/highlight'

export default function Home() {
  const highlights = parseHome()

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {highlights.map((highlight, index) => (
        <HighlightBlock key={index} data={highlight} />
      ))}
    </main>
  )
}