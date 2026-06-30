import { ImageResponse } from 'next/og'

export const alt = 'Command 360 — Interactive Command Training for UK Emergency Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded default social card (used wherever a page doesn't set its own image).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0F1216',
          color: '#ffffff',
          padding: 84,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 30, height: 30, background: '#C9241A' }} />
          <div style={{ fontSize: 26, letterSpacing: 6, color: '#9aa0a8', fontWeight: 600 }}>COMMAND 360</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ display: 'flex', fontSize: 66, fontWeight: 800, lineHeight: 1.04, maxWidth: 940 }}>
            Interactive command training for UK emergency services
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#aab0b8', maxWidth: 860, lineHeight: 1.4 }}>
            Briefings, live decisions and debriefs — turned into structured learning with AI insight.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, color: '#9aa0a8' }}>
          <div style={{ width: 11, height: 11, borderRadius: 9999, background: '#2E9E63' }} />
          command360.co.uk
        </div>
      </div>
    ),
    { ...size }
  )
}
