'use client'
import { QRCodeSVG } from 'qrcode.react'

export function QRCodeDisplay({ roomCode }: { roomCode: string }) {
  const joinUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/${roomCode}`
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="bg-white p-4 rounded-none shadow-2xl">
        <QRCodeSVG value={joinUrl} size={160} />
      </div>
      <div>
        <p className="text-muted-foreground text-xs mb-1">Scan to join or go to /join</p>
        <p className="text-primary text-3xl font-mono font-bold mt-2 tracking-[0.2em]">{roomCode}</p>
      </div>
    </div>
  )
}
