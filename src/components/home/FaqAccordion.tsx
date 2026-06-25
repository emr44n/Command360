'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={item.q}
            className={`rounded-xl border overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'border-red-500/30 bg-red-500/[0.06] shadow-lg shadow-red-500/5'
                : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
              aria-expanded={isOpen}
            >
              <h4 className={`font-semibold text-sm transition-colors ${isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{item.q}</h4>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-red-400' : 'text-white/40'}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="text-white/55 text-sm leading-relaxed px-5 pb-5">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
