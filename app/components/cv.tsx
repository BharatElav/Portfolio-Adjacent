'use client'

import { CV } from '@/lib/parseCV'
import { Course } from '@/lib/parseCourses'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
    const [stacked, setStacked] = useState(false)
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const containerRef = useRef<HTMLDivElement | null>(null)
    const tabBarRef = useRef<HTMLDivElement | null>(null)
    const wrapRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        const SIDEBAR_WIDTH = 144 // w-36
        const MIN_CONTENT_WIDTH = 480 // comfortable minimum for CV content

        const check = () => {
            const el = wrapRef.current
            if (!el) return
            setStacked(el.clientWidth < SIDEBAR_WIDTH + MIN_CONTENT_WIDTH)
        }
        check()
        const ro = new ResizeObserver(check)
        if (wrapRef.current) ro.observe(wrapRef.current)
        return () => ro.disconnect()
    }, [])

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

    useEffect(() => {
        const bar = tabBarRef.current
        const tab = tabRefs.current[active]
        if (!bar || !tab) return
        const target = tab.offsetLeft + tab.offsetWidth / 2 - bar.clientWidth / 2
        bar.scrollTo({ left: target, behavior: 'smooth' })
    }, [active])

    const scrollTo = (id: string) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className={`h-screen snap-start snap-always flex overflow-hidden pt-20 justify-center bg-[var(--background)] ${stacked ? 'flex-col' : 'flex-row'}`}>
            <div ref={wrapRef} className={`flex w-full max-w-5xl h-full ${stacked ? 'flex-col' : 'flex-row'}`}>
                <div ref={tabBarRef} className={`sticky top-0 z-10 bg-[var(--background)] shrink-0 px-4 gap-4 overscroll-contain [&::-webkit-scrollbar]:hidden flex ${stacked ? 'w-full flex-row py-4 overflow-x-auto overflow-y-hidden' : 'w-36 flex-col py-12 overflow-y-auto overflow-x-hidden'}`}>
                    {sections.map((s) => (
                        <button
                            key={s}
                            ref={(el) => { tabRefs.current[s] = el }}
                            onClick={() => scrollTo(s)}
                            className={`shrink-0 text-left text-sm whitespace-nowrap transition-colors ${stacked ? 'pb-1' : 'pl-2'} ${active === s
                                ? `text-black dark:text-white font-bold ${stacked ? 'border-b-2' : 'border-l-2'} border-black dark:border-white`
                                : 'text-gray-400 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div ref={containerRef} className={`flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-6 [&::-webkit-scrollbar]:hidden ${stacked ? 'px-4 py-8' : 'px-10 py-12'}`}>
                    <div id="Contact" ref={(el) => { sectionRefs.current['Contact'] = el }} className="rounded-xl p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-black dark:text-white">Contact Information</h2>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm md:text-base">
                            <span className="font-semibold text-black dark:text-white">Name</span>
                            <span className="text-black dark:text-white break-words min-w-0">{data.contact.name}</span>
                            <span className="font-semibold text-black dark:text-white">Email</span>
                            <a href={`mailto:${data.contact.email}`} className="hover:underline text-black dark:text-white break-all min-w-0">{data.contact.email}</a>
                        </div>
                    </div>

                    <div id="Experience" ref={(el) => { sectionRefs.current['Experience'] = el }} className="rounded-xl p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-8 text-black dark:text-white">Experience</h2>
                        <div className="flex flex-col gap-10">
                            {data.experience.map((exp, i) => {
                                return (
                                    <div key={i}>
                                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="font-bold text-base md:text-lg hover:opacity-70 transition-opacity text-black dark:text-white">
                                            {exp.company}
                                        </a>
                                        <div className="mt-4 flex flex-col gap-6">
                                            {exp.roles.map((role, j) => {
                                                return (
                                                    <div key={j}>
                                                        <h4 className="font-semibold text-sm md:text-base text-black dark:text-white">{role.role}</h4>
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

                    <div id="Education" ref={(el) => { sectionRefs.current['Education'] = el }} className="rounded-xl p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-8 text-black dark:text-white">Education</h2>
                        <div className="flex flex-col gap-10">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    {edu.link ? (
                                        <a href={edu.link} target="_blank" rel="noopener noreferrer" className="font-bold text-base md:text-lg hover:opacity-70 transition-opacity text-black dark:text-white">
                                            {edu.institution}
                                        </a>
                                    ) : (
                                        <h3 className="font-bold text-base md:text-lg text-black dark:text-white">{edu.institution}</h3>
                                    )}
                                    <div className="mt-4 flex flex-col gap-6">
                                        {edu.programs.map((prog, j) => (
                                            <div key={j}>
                                                <h4 className="font-semibold text-sm md:text-base text-black dark:text-white">{prog.degree}</h4>
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

                    <div id="Skills" ref={(el) => { sectionRefs.current['Skills'] = el }} className="rounded-xl p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-black dark:text-white">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="text-sm border border-transparent text-black dark:text-white px-3 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div id="References" ref={(el) => { sectionRefs.current['References'] = el }} className="rounded-xl p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-black dark:text-white">References</h2>
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