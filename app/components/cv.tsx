'use client'

import { CV } from '@/lib/parseCV'
import { Course } from '@/lib/parseCourses'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = ['Contact', 'Experience', 'Education', 'Skills', 'References']

function CourseCategoryBlock({
    name,
    description,
    courses,
}: {
    name: string
    description: string
    courses: Course[]
}) {
    const [open, setOpen] = useState(false)

    return (
        <motion.div
            className="border border-transparent rounded-lg overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left px-4 py-3 flex items-center justify-between"
            >
                <div>
                    <p className="text-sm font-semibold text-black dark:text-white">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
                </div>
                <span className="text-xs text-gray-400 ml-4 shrink-0">{open ? '−' : '+'}</span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 flex flex-col gap-4">
                            {courses.map((course) => (
                                <div key={course.name}>
                                    <p className="text-sm font-medium text-black dark:text-white">{course.name}</p>
                                    {course.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                            {course.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default function CVSection({ data, courses }: { data: CV; courses: Course[] }) {
    const [active, setActive] = useState('Contact')
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const containerTop = container.getBoundingClientRect().top
            let closest = sections[0]
            let closestDistance = Infinity

            sections.forEach((s) => {
                const el = sectionRefs.current[s]
                if (!el) return
                const distance = Math.abs(el.getBoundingClientRect().top - containerTop - 20)
                if (distance < closestDistance) {
                    closestDistance = distance
                    closest = s
                }
            })

            setActive(closest)
        }

        container.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollTo = (id: string) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="h-screen snap-start snap-always flex overflow-hidden pt-20 justify-center bg-[var(--background)]">
            <div className="flex w-full max-w-5xl">
                <div className="w-36 shrink-0 px-4 py-12 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {sections.map((s) => (
                        <button
                            key={s}
                            onClick={() => scrollTo(s)}
                            className={`text-left text-sm transition-colors ${active === s
                                ? 'text-black dark:text-white font-bold border-l-2 border-black dark:border-white pl-2'
                                : 'text-gray-400 hover:text-black dark:hover:text-white pl-2'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div ref={containerRef} className="flex-1 overflow-y-auto px-10 py-12 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
                    <div id="Contact" ref={(el) => { sectionRefs.current['Contact'] = el }} className="rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Contact Information</h2>
                        <div className="grid grid-cols-2 gap-y-3">
                            <span className="font-semibold text-black dark:text-white">Name</span>
                            <span className="text-black dark:text-white">{data.contact.name}</span>
                            <span className="font-semibold text-black dark:text-white">Email</span>
                            <a href={`mailto:${data.contact.email}`} className="hover:underline text-black dark:text-white">{data.contact.email}</a>
                        </div>
                    </div>

                    <div id="Experience" ref={(el) => { sectionRefs.current['Experience'] = el }} className="rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">Experience</h2>
                        <div className="flex flex-col gap-10">
                            {data.experience.map((exp, i) => {
                                return (
                                    <div key={i}>
                                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:opacity-70 transition-opacity text-black dark:text-white">
                                            {exp.company}
                                        </a>
                                        <div className="mt-4 flex flex-col gap-6">
                                            {exp.roles.map((role, j) => {
                                                return (
                                                    <div key={j}>
                                                        <h4 className="font-semibold text-base text-black dark:text-white">{role.role}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {role.start} — {role.end}{role.location ? ` · ${role.location}` : ''}
                                                        </p>
                                                        {role.description ? (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                                                {role.description}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div id="Education" ref={(el) => { sectionRefs.current['Education'] = el }} className="rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">Education</h2>
                        <div className="flex flex-col gap-10">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    {edu.link ? (
                                        <a href={edu.link} target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:opacity-70 transition-opacity text-black dark:text-white">
                                            {edu.institution}
                                        </a>
                                    ) : (
                                        <h3 className="font-bold text-lg text-black dark:text-white">{edu.institution}</h3>
                                    )}
                                    <div className="mt-4 flex flex-col gap-6">
                                        {edu.programs.map((prog, j) => (
                                            <div key={j}>
                                                <h4 className="font-semibold text-base text-black dark:text-white">{prog.degree}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {prog.start} — {prog.end}{prog.gpa ? ` · GPA: ${prog.gpa}` : ''}
                                                </p>
                                                {prog.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                                        {prog.description}
                                                    </p>
                                                )}
                                                {prog.courseCategories && prog.courseCategories.length > 0 && (
                                                    <div className="mt-4 flex flex-col gap-2">
                                                        {prog.courseCategories.map((cat) => (
                                                            <CourseCategoryBlock
                                                                key={cat.name}
                                                                name={cat.name}
                                                                description={cat.description}
                                                                courses={courses.filter((c) => c.category === cat.name)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div id="Skills" ref={(el) => { sectionRefs.current['Skills'] = el }} className="rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-sm border border-transparent text-black dark:text-white px-3 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div id="References" ref={(el) => { sectionRefs.current['References'] = el }} className="rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">References</h2>
                        <div className="flex flex-col gap-6">
                            {data.references.map((ref, i) => (
                                <div key={i}>
                                    <p className="font-bold text-black dark:text-white">{ref.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{ref.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ref.relationship}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}