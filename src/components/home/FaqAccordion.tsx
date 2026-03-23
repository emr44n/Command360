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
            className="rounded-xl border border-border/60 bg-card/50 overflow-hidden [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.02)_inset] transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
            >
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{item.q}</h4>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="text-muted-foreground text-sm leading-relaxed px-5 pb-5">
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
