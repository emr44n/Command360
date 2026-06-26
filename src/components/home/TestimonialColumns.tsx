'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface Testimonial {
  quote: string
  name: string
  role: string
  color: string
}

const POOL: Testimonial[] = [
  { quote: 'Command 360 changed how we run debriefs. Every firefighter now has a voice, not just the loudest in the room.', name: 'James Thornton', role: 'Station Officer · WM Fire', color: '#D94B3D' },
  { quote: 'The quiz leaderboards bring real energy to sessions that used to feel flat. Pass rates on competency checks are up.', name: 'Sarah Mitchell', role: 'Training Lead · Met Police', color: '#3E6DC4' },
  { quote: 'Anonymous Q&A has been a game-changer for governance meetings. Paramedics raise issues they never would face-to-face.', name: 'Dr Priya Sharma', role: 'Clinical Lead · EM Ambulance', color: '#2E9E63' },
  { quote: 'Rolling it out across our volunteer teams was painless — a code on the screen and everyone is connected.', name: 'Mark Evans', role: 'Operations Manager · Lowland Rescue', color: '#8a7d3a' },
  { quote: 'We run incident reviews straight from a template. The AI summary saves us writing up notes for hours.', name: 'Karen Doyle', role: 'Watch Manager · HM Coastguard', color: '#2592a3' },
  { quote: 'Multi-agency exercises finally feel joined-up. Everyone responds live, and we export the record in one click.', name: 'David O’Brien', role: 'L&D Lead · Local Authority', color: '#6a5ea8' },
]

const COLUMNS = [
  { items: [POOL[0], POOL[3]], dir: 1, delay: 0 },
  { items: [POOL[1], POOL[4]], dir: -1, delay: 900 },
  { items: [POOL[2], POOL[5]], dir: 1, delay: 1800 },
]

function Column({ items, dir, delay }: { items: Testimonial[]; dir: number; delay: number }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      setI((v) => (v + 1) % items.length)
      interval = setInterval(() => setI((v) => (v + 1) % items.length), 5200)
    }, delay + 5200)
    return () => { clearTimeout(start); clearInterval(interval) }
  }, [items.length, delay])

  const t = items[i]

  return (
    <div className="relative h-full overflow-hidden border-r border-b border-[rgba(20,25,30,0.16)]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={t.name}
          initial={{ y: dir * 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: dir * -36, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-[34px_30px] h-full flex flex-col"
        >
          <div className="ff-display font-black text-[40px] leading-[0.7] text-[#C9241A] mb-[18px]">&ldquo;</div>
          <p className="text-[15.5px] leading-[1.6] text-[#34383d] font-medium mb-[22px] flex-1">{t.quote}</p>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 shrink-0" style={{ background: t.color }} />
            <div>
              <div className="font-bold text-[13.5px] text-[#16191E]">{t.name}</div>
              <div className="ff-mono text-[11px] text-[#8a8579]">{t.role}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function TestimonialColumns() {
  return (
    <div className="grid md:grid-cols-3 border-t border-l border-[rgba(20,25,30,0.16)]">
      {COLUMNS.map((col, idx) => (
        <div key={idx} className="h-[260px]">
          <Column items={col.items} dir={col.dir} delay={col.delay} />
        </div>
      ))}
    </div>
  )
}
