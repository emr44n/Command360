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
                ? 'border-red-200 bg-red-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
              aria-expanded={isOpen}
            >
              <h4 className={`font-semibold text-sm transition-colors ${isOpen ? 'text-red-700' : 'text-slate-900 group-hover:text-red-600'}`}>{item.q}</h4>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-red-600' : 'text-slate-400'}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="text-slate-600 text-sm leading-relaxed px-5 pb-5">
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
