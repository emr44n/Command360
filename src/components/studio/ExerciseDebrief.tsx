'use client'

export interface ExerciseStats {
  duration: number
  eventsTriggered: number
  assetsAdded: number
  presenterName: string
  sceneName: string
  startTime: string
  endTime: string
}

export function ExerciseDebrief({ stats, onReturn }: { stats: ExerciseStats; onReturn: () => void }) {
  const formatDuration = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0b] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(220,38,38,0.1),transparent)] pointer-events-none" />
      <div className="relative text-center max-w-lg mx-auto px-6">
        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-2">Command 360</p>
        <h1 className="text-2xl font-bold text-white mb-2">Exercise Complete</h1>
        <p className="text-sm text-zinc-400 mb-8">{stats.sceneName}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{formatDuration(stats.duration)}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">Duration</p>
          </div>
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{stats.eventsTriggered}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">Events</p>
          </div>
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{stats.assetsAdded}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">Assets Pushed</p>
          </div>
        </div>

        {stats.presenterName && <p className="text-[11px] text-zinc-500 mb-1">Presenter: {stats.presenterName}</p>}
        <p className="text-[10px] text-zinc-600 mb-8">{new Date(stats.startTime).toLocaleString()} — {new Date(stats.endTime).toLocaleString()}</p>

        <button onClick={onReturn} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25">
          Return to Build Mode
        </button>
      </div>
    </div>
  )
}
