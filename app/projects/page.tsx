import { parseProjects } from '@/lib/parseProjects'
import ProjectGrid from '@/app/components/projectgrid'

export default function ProjectsPage() {
  const projects = parseProjects()

  return (
    <main className="min-h-screen pt-32 px-16 pb-16 bg-[var(--background)]">
      <h1 className="text-5xl font-bold mb-12 text-black dark:text-white">Projects</h1>
      <ProjectGrid projects={projects} />
    </main>
  )
}