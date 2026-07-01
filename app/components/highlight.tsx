'use client'

import { Highlight } from '@/lib/parseHome'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function HighlightBlock({ data }: { data: Highlight }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <section
      ref={ref}
      className={`flex items-center gap-8 h-screen px-16 pt-20 snap-start snap-always ${
        data.side === 'left' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <motion.div
        className="w-1/2"
        initial={{ opacity: 0, x: data.side === 'left' ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {data.mediaType === 'video' ? (
          <video
            src={data.media}
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-lg"
          />
        ) : (
          <img src={data.media} alt="" className="w-full rounded-lg" />
        )}
      </motion.div>

      <motion.div
        className="w-1/2"
        initial={{ opacity: 0, x: data.side === 'left' ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
      >
        <p className="text-lg">{data.content}</p>
      </motion.div>
    </section>
  )
}