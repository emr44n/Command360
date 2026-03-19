export type SlideType = 'poll' | 'word_cloud' | 'quiz' | 'qna' | 'survey' | 'content' | 'rating_scale' | 'open_text'

export interface PollOption {
  id: string
  text: string
}

export interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

export interface SurveyOption {
  id: string
  text: string
}

export interface SurveyQuestion {
  id: string
  text: string
  type: 'text' | 'rating' | 'single_choice' | 'multiple_choice'
  options?: SurveyOption[]
  required: boolean
  rating_max?: number
}

export interface PollContent {
  options: PollOption[]
  allow_multiple: boolean
  show_results_immediately: boolean
  chart_type: 'bar' | 'donut' | 'horizontal_bar'
  description?: string
  image_url?: string
}

export interface WordCloudContent {
  prompt?: string
  max_words_per_person?: number
  profanity_filter?: boolean
  description?: string
  image_url?: string
}

export interface QuizContent {
  options: QuizOption[]
  time_limit_seconds: number
  points: number
  explanation?: string
  shuffle_options: boolean
  description?: string
  image_url?: string
}

export interface QnAContent {
  allow_anonymous_questions: boolean
  upvotes_enabled: boolean
  moderation_enabled: boolean
  description?: string
  image_url?: string
}

export interface SurveyContent {
  questions: SurveyQuestion[]
  description?: string
  image_url?: string
}

export interface ContentSlideContent {
  body: string
  image_url?: string
  layout: 'text_only' | 'image_only' | 'text_left' | 'text_right'
  background_color?: string
  description?: string
}

export interface RatingScaleContent {
  min_value: number
  max_value: number
  min_label: string
  max_label: string
  step: number
  show_average: boolean
  description?: string
  image_url?: string
}

export interface OpenTextContent {
  placeholder: string
  max_length: number
  allow_multiple_submissions: boolean
  show_responses_live: boolean
  description?: string
  image_url?: string
}

export type SlideContent =
  | PollContent
  | WordCloudContent
  | QuizContent
  | QnAContent
  | SurveyContent
  | ContentSlideContent
  | RatingScaleContent
  | OpenTextContent

export interface CanvasElement {
  id: string
  type: 'text' | 'image'
  x: number      // percentage 0-100
  y: number      // percentage 0-100
  width: number   // percentage 0-100
  height: number  // percentage 0-100
  rotation: number
  content: string // text content or image URL
  style?: {
    fontSize?: number
    fontWeight?: string
    color?: string
    textAlign?: string
    fontStyle?: string
    backgroundColor?: string
    borderRadius?: number
    opacity?: number
    objectFit?: string
  }
}

export interface Slide {
  id: string
  presentation_id: string
  slide_type: SlideType
  position: number
  title: string
  content: SlideContent
  speaker_notes?: string
  created_at: string
  updated_at: string
}
