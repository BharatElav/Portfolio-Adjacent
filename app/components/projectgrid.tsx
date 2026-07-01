'use client'

import { Project } from '@/lib/parseProjects'
import ProjectCard from '@/app/components/projectcard'
import { useState } from 'react'
import { motion } from 'framer-motion'

const tags = ['All', 'Formula SAE', 'Hackathons', 'Research']

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? projects : projects.filter(p => p.tag === active)

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 mb-10">
        {tags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => setActive(tag)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors relative overflow-hidden ${
              active === tag
                ? 'border-black/0 dark:border-white/0 bg-black dark:bg-white text-white dark:text-black'
                : 'border-black/0 dark:border-white/0 text-black dark:text-white hover:text-white dark:hover:text-black'
            }`}
            whileHover="hover"
          >
            {active !== tag && (
              <motion.span
                className="absolute inset-0 rounded-full bg-black dark:bg-white"
                initial={{ scale: 0, opacity: 0 }}
                variants={{ hover: { scale: 1, opacity: 1 } }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
              />
            )}
            <span className="relative z-10">{tag}</span>
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}