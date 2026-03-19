'use client'
import { ShieldAlert } from 'lucide-react'

interface WaitingScreenProps {
  message?: string
  subMessage?: string
}

export function WaitingScreen({ message = 'Waiting for presenter...', subMessage }: WaitingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="text-center space-y-6 animate-in fade-in duration-500">
        {/* Animated ring */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-[2.5px] border-primary/10" />
          <div className="absolute inset-0 rounded-full border-[2.5px] border-primary border-t-transparent border-r-transparent animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-primary/50" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{message}</h2>
          {subMessage && <p className="text-muted-foreground text-sm font-medium">{subMessage}</p>}
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
