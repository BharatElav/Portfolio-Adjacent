import { parseHome } from '@/lib/parseHome'
import { parseCV } from '@/lib/parseCV'
import { parseCourses } from '@/lib/parseCourses'
import HighlightBlock from '@/app/components/highlight'
import CVSection from '@/app/components/cv'

export default function Home() {
  const highlights = parseHome()
  const cv = parseCV()
  const courses = parseCourses()

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden">
      {highlights.map((highlight, index) => (
        <HighlightBlock key={index} data={highlight} />
      ))}
      <CVSection data={cv} courses={courses} />
    </main>
  )
}