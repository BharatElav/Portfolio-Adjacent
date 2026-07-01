'use client'

import { CV } from '@/lib/parseCV'
import { useEffect, useRef, useState } from 'react'

const sections = ['Contact', 'Experience', 'Education', 'Skills', 'References']

export default function CVSection({ data }: { data: CV }) {
    const [active, setActive] = useState('Contact')
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id)
                    }
                })
            },
            { threshold: 0.3, rootMargin: '-10% 0px -40% 0px' }
        )

        Object.values(sectionRefs.current).forEach((el) => {
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
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

                <div className="flex-1 overflow-y-auto px-10 py-12 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
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
                                <span key={i} className="text-sm border border-black/20 dark:border-white/20 text-black dark:text-white px-3 py-1 rounded-full">
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