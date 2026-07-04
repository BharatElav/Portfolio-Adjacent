'use client'

import { useEffect } from 'react'

export default function ScrollController() {
    useEffect(() => {
        const main = document.querySelector('main')
        if (!main) return

        let isTransitioning = false

        // All snap sections: highlights + the CV section (last child)
        const getSections = () => Array.from(main.querySelectorAll('section')) as HTMLElement[]

        const getCVSection = () => {
            const sections = getSections()
            return sections[sections.length - 1] ?? null
        }

        // Index of the section whose top is closest to the current scroll position
        const currentIndex = () => {
            const sections = getSections()
            let closest = 0
            let closestDistance = Infinity
            sections.forEach((el, i) => {
                const distance = Math.abs(el.getBoundingClientRect().top)
                if (distance < closestDistance) {
                    closestDistance = distance
                    closest = i
                }
            })
            return closest
        }

        // True when the CV section's top is at (or above) the viewport top,
        // i.e. we're scrolled into CV territory
        const inCV = () => {
            const cv = getCVSection()
            if (!cv) return false
            return cv.getBoundingClientRect().top <= 1
        }

        // True only when the Contact card (the CV's first content) has fully
        // arrived at the viewport top — meaning there's nothing left to scroll
        // up to within the CV, so an upward flick genuinely means "exit the CV"
        const atCVTop = () => {
            const cv = getCVSection()
            if (!cv) return false
            const firstCard = cv.querySelector('#Contact') as HTMLElement | null
            if (!firstCard) return false
            const top = firstCard.getBoundingClientRect().top
            return top >= -1 && top <= 100 // tolerance for the sticky tab bar height
        }

        const scrollToSection = (index: number) => {
            const sections = getSections()
            const target = sections[Math.max(0, Math.min(index, sections.length - 1))]
            if (!target) return
            isTransitioning = true
            target.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => {
                isTransitioning = false
            }, 800)
        }

        const handleWheel = (e: WheelEvent) => {
            // Inside the CV (and not trying to leave from its very top): native scroll
            if (inCV()) {
                if (e.deltaY < 0 && atCVTop()) {
                    // Scrolling up from the CV's top edge → flick back to last highlight
                    e.preventDefault()
                    if (isTransitioning) return
                    scrollToSection(currentIndex() - 1)
                }
                return
            }

            // In the highlights zone: hijack and convert to flicks
            e.preventDefault()
            if (isTransitioning) return
            if (Math.abs(e.deltaY) < 10) return

            const direction = e.deltaY > 0 ? 1 : -1
            scrollToSection(currentIndex() + direction)
        }

        main.addEventListener('wheel', handleWheel, { passive: false })
        return () => main.removeEventListener('wheel', handleWheel)
    }, [])

    return null
}