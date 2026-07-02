'use client'

import { Highlight } from '@/lib/parseHome'
import { motion } from 'framer-motion'

export default function HighlightBlock({ data }: { data: Highlight }) {
  return (
    <section
      className={`flex items-center gap-8 h-screen px-16 pt-20 snap-start snap-always ${
        data.side === 'left' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <motion.div
        className="w-1/2"
        initial={{ opacity: 0, x: data.side === 'left' ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.5 }}
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
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
      >
        <p className="text-lg">{data.content}</p>
      </motion.div>
    </section>
  )
}