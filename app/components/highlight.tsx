'use client'

import { Highlight } from '@/lib/parseHome'
import { motion } from 'framer-motion'

export default function HighlightBlock({ data }: { data: Highlight }) {
  return (
    <section
      className={`flex flex-col sm:flex-row items-center justify-center gap-8 min-h-screen sm:h-screen px-6 sm:px-16 pt-20 snap-start snap-always ${
        data.side === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
      }`}
    >
      <motion.div
        className="w-full sm:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: data.side === 'left' ? -60 : 60 }}
        whileInView={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {data.mediaType === 'video' ? (
          <video
            src={data.media}
            autoPlay
            loop
            muted
            playsInline
            className="max-h-[45vh] max-w-full w-auto object-contain rounded-lg"
          />
        ) : (
          <img src={data.media} alt="" className="max-h-[45vh] max-w-full w-auto object-contain rounded-lg" />
        )}
      </motion.div>

      <motion.div
        className="w-full sm:w-1/2 text-center sm:text-left"
        initial={{ opacity: 0, x: data.side === 'left' ? 60 : -60 }}
        whileInView={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: 'easeOut', delay: 0.5 },
        }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="text-[clamp(0.85rem,3vh,1.125rem)] leading-snug break-words">{data.content}</p>
      </motion.div>
    </section>
  )
}