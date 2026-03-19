'use client'
import type { Session } from '@/types/session'
import type { Slide } from '@/types/slide'
import { PollResultsDisplay } from './slide-displays/PollResultsDisplay'
import { WordCloudDisplay } from './slide-displays/WordCloudDisplay'
import { QuizDisplay } from './slide-displays/QuizDisplay'
import { QnADisplay } from './slide-displays/QnADisplay'
import { SurveyResultsDisplay } from './slide-displays/SurveyResultsDisplay'
import { RatingScaleDisplay } from './slide-displays/RatingScaleDisplay'
import { OpenTextDisplay } from './slide-displays/OpenTextDisplay'

interface Props { slide: Slide; session: Session; responseCount: number }

export function PresenterSlideDisplay({ slide, session, responseCount }: Props) {
  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-border">
      <div className="px-8 pt-8 pb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10 uppercase tracking-wide mb-3">
          {slide.slide_type.replace('_', ' ')}
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
          {slide.title || <span className="text-muted-foreground italic font-normal">Untitled slide</span>}
        </h2>
      </div>
      <div className="px-8 pb-8">
        <SlideContent slide={slide} session={session} responseCount={responseCount} />
      </div>
    </div>
  )
}

function SlideContent({ slide, session, responseCount }: Props) {
  switch (slide.slide_type) {
    case 'poll': return <PollResultsDisplay slide={slide} sessionId={session.id} />
    case 'word_cloud': return <WordCloudDisplay slide={slide} sessionId={session.id} />
    case 'quiz': return <QuizDisplay slide={slide} sessionId={session.id} />
    case 'qna': return <QnADisplay slide={slide} session={session} />
    case 'survey': return <SurveyResultsDisplay slide={slide} sessionId={session.id} />
    case 'content': return <ContentDisplay slide={slide} />
    case 'rating_scale': return <RatingScaleDisplay slide={slide} sessionId={session.id} />
    case 'open_text': return <OpenTextDisplay slide={slide} sessionId={session.id} />
    default: return null
  }
}

function ContentDisplay({ slide }: { slide: Slide }) {
  const content = slide.content as { body: string }
  return <div className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap min-h-32">{content.body}</div>
}
