import type { SlideType, SlideContent } from '@/types/slide'

export const SLIDE_TYPE_INFO: Record<SlideType, { label: string; description: string; color: string }> = {
  poll: {
    label: 'Poll',
    description: 'Multiple choice voting',
    color: 'violet',
  },
  word_cloud: {
    label: 'Word Cloud',
    description: 'Collect single word responses',
    color: 'blue',
  },
  quiz: {
    label: 'Quiz',
    description: 'Timed question with scoring',
    color: 'emerald',
  },
  qna: {
    label: 'Q&A',
    description: 'Open question submission',
    color: 'amber',
  },
  survey: {
    label: 'Survey',
    description: 'Multi-question form',
    color: 'pink',
  },
  content: {
    label: 'Content',
    description: 'Text or image slide',
    color: 'gray',
  },
  rating_scale: {
    label: 'Rating Scale',
    description: 'Numeric scale response',
    color: 'orange',
  },
  open_text: {
    label: 'Open Text',
    description: 'Free-text responses',
    color: 'teal',
  },
}

export function getDefaultSlideContent(type: SlideType): SlideContent {
  switch (type) {
    case 'poll':
      return {
        options: [
          { id: crypto.randomUUID(), text: 'Option A' },
          { id: crypto.randomUUID(), text: 'Option B' },
          { id: crypto.randomUUID(), text: 'Option C' },
        ],
        allow_multiple: false,
        show_results_immediately: true,
        chart_type: 'horizontal_bar',
      }
    case 'word_cloud':
      return {
        prompt: 'What word comes to mind?',
        max_words_per_person: 1,
        profanity_filter: true,
      }
    case 'quiz':
      return {
        options: [
          { id: crypto.randomUUID(), text: 'Option A', is_correct: false },
          { id: crypto.randomUUID(), text: 'Option B', is_correct: true },
          { id: crypto.randomUUID(), text: 'Option C', is_correct: false },
          { id: crypto.randomUUID(), text: 'Option D', is_correct: false },
        ],
        time_limit_seconds: 30,
        points: 1000,
        explanation: '',
        shuffle_options: false,
      }
    case 'qna':
      return {
        allow_anonymous_questions: false,
        upvotes_enabled: true,
        moderation_enabled: false,
      }
    case 'survey':
      return {
        questions: [
          {
            id: crypto.randomUUID(),
            text: 'How satisfied are you?',
            type: 'rating',
            required: true,
            rating_max: 5,
          },
        ],
      }
    case 'content':
      return {
        body: '',
        layout: 'text_only',
      }
    case 'rating_scale':
      return {
        min_value: 1,
        max_value: 10,
        min_label: 'Not at all',
        max_label: 'Completely',
        step: 1,
        show_average: true,
      }
    case 'open_text':
      return {
        placeholder: 'Type your response here...',
        max_length: 500,
        allow_multiple_submissions: false,
        show_responses_live: true,
      }
  }
}
