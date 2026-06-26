'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

const BULLETS = ['#C9241A', '#3E6DC4', '#2E9E63', '#8a7d3a', '#6a5ea8', '#2592a3']

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="border-t border-x border-white/12">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const c = BULLETS[i % BULLETS.length]
        return (
          <div
            key={item.q}
            className={`border-b border-white/12 transition-colors duration-200 ${isOpen ? 'bg-white/[0.04]' : 'hover:bg-white/[0.025]'}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-3.5 p-5 text-left cursor-pointer group"
              aria-expanded={isOpen}
            >
              <span className="w-2.5 h-2.5 shrink-0" style={{ background: c }} aria-hidden="true" />
              <h4 className={`flex-1 font-semibold text-sm transition-colors ${isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{item.q}</h4>
              <Plus className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-white' : 'text-white/40'}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <p className="text-white/55 text-sm leading-relaxed px-5 pb-5 pl-[34px]">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
