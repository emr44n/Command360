'use client'
import type { Session } from '@/types/session'
import type { Slide } from '@/types/slide'
import { SlideElementsView } from '@/components/slides/SlideElementsView'
import { PollResultsDisplay } from './slide-displays/PollResultsDisplay'
import { WordCloudDisplay } from './slide-displays/WordCloudDisplay'
import { QuizDisplay } from './slide-displays/QuizDisplay'
import { QnADisplay } from './slide-displays/QnADisplay'
import { SurveyResultsDisplay } from './slide-displays/SurveyResultsDisplay'
import { RatingScaleDisplay } from './slide-displays/RatingScaleDisplay'
import { OpenTextDisplay } from './slide-displays/OpenTextDisplay'
import { StudioDisplay } from './slide-displays/StudioDisplay'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Props { slide: Slide; session: Session; responseCount: number; channelRef?: React.RefObject<RealtimeChannel | null>; allSlides?: Slide[]; mode?: 'preview' | 'present' }

export function PresenterSlideDisplay({ slide, session, responseCount, channelRef, allSlides, mode }: Props) {
  // Studio slides get full-bleed canvas without title/badge wrapper
  if (slide.slide_type === 'studio') {
    return (
      <div className="w-full h-full">
        <StudioDisplay slide={slide} session={session} channelRef={channelRef} allSlides={allSlides} mode={mode} />
      </div>
    )
  }

  // Content slides are a composed canvas (title + body are movable boxes), so
  // they project full-bleed on a 16:9 white surface — no title/badge frame.
  if (slide.slide_type === 'content') {
    return (
      <div className="bg-white rounded-none overflow-hidden shadow-2xl border border-border relative" style={{ aspectRatio: '16/9' }}>
        <SlideElementsView slide={slide} />
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-none overflow-hidden shadow-2xl border border-border relative"
      style={{ aspectRatio: '16/9' }}
    >
      <div className="absolute inset-0 flex flex-col px-8 pt-8 pb-6">
        <div className="shrink-0 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-semibold text-primary bg-primary/10 uppercase tracking-wide mb-3">
            {slide.slide_type.replace('_', ' ')}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-[#16191E] tracking-tight">
            {slide.title || <span className="text-[#9aa0a8] italic font-normal">Untitled slide</span>}
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
          <div className="w-full">
            <SlideContent slide={slide} session={session} responseCount={responseCount} channelRef={channelRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideContent({ slide, session, responseCount, channelRef, allSlides }: Props) {
  switch (slide.slide_type) {
    case 'poll': return <PollResultsDisplay slide={slide} sessionId={session.id} />
    case 'word_cloud': return <WordCloudDisplay slide={slide} sessionId={session.id} />
    case 'quiz': return <QuizDisplay slide={slide} sessionId={session.id} />
    case 'qna': return <QnADisplay slide={slide} session={session} />
    case 'survey': return <SurveyResultsDisplay slide={slide} sessionId={session.id} />
    case 'rating_scale': return <RatingScaleDisplay slide={slide} sessionId={session.id} />
    case 'open_text': return <OpenTextDisplay slide={slide} sessionId={session.id} />
    case 'studio': return <StudioDisplay slide={slide} session={session} channelRef={channelRef} allSlides={allSlides} />
    default: return null
  }
}

