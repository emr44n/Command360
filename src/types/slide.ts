export type SlideType = 'poll' | 'word_cloud' | 'quiz' | 'qna' | 'survey' | 'content' | 'rating_scale' | 'open_text' | 'studio'

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

/* ── Studio (Command Studio) ── */

export interface StudioLayer {
  id: string
  name: string
  type: 'image' | 'video' | 'text' | 'shape' | 'audio'
  src?: string
  x: number        // percentage 0-100
  y: number
  width: number
  height: number
  rotation: number  // degrees
  zIndex: number
  opacity: number   // 0-1
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'
  visible: boolean
  locked: boolean
  // Text-specific
  text?: string
  fontSize?: number
  fontWeight?: string
  color?: string
  fontFamily?: string
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: number
  letterSpacing?: number
  // Video-specific
  loop?: boolean
  autoplay?: boolean
  muted?: boolean
  // Audio-specific
  volume?: number      // 0-1 range, default 1
  audioLoop?: boolean
}

export interface StudioAction {
  id: string
  layerId: string
  property: 'opacity' | 'visible' | 'x' | 'y' | 'width' | 'height' | 'rotation' | 'src' | 'scaleX' | 'scaleY' | 'volume'
  fromValue?: number | boolean | string
  toValue: number | boolean | string
  delay: number       // ms before starting
  duration: number    // ms for transition
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  endBehaviour: 'stay' | 'fadeOut' | 'reset'
  endDelay?: number   // ms after duration before end behaviour fires
}

export interface StudioVoteOption {
  id: string
  label: string
  triggersEventId?: string
}

export interface StudioEvent {
  id: string
  name: string
  categoryId?: string
  icon?: string
  color?: string
  trigger: 'manual' | 'vote'
  voteQuestion?: string
  voteOptions?: StudioVoteOption[]
  actions: StudioAction[]
}

export interface StudioEventCategory {
  id: string
  name: string
  color?: string
}

export interface StudioLayerState {
  visible: boolean
  opacity: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  src?: string
  volume?: number  // 0-1 for audio layers
}

/* ── Timeline types (v2) ── */

export interface StudioTrack {
  id: string
  layerId: string
  name: string
  muted: boolean
  hidden: boolean
  locked: boolean
  color: string
  clips: StudioClip[]
}

export interface StudioClip {
  id: string
  trackId: string
  startTime: number    // ms from timeline start
  duration: number     // ms
  trimStart: number    // ms trimmed from beginning
  trimEnd: number      // ms trimmed from end
  keyframes: StudioKeyframe[]
}

export interface StudioKeyframe {
  id: string
  time: number         // ms offset within clip
  property: 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'visible' | 'src' | 'volume'
  value: number | boolean | string
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

export interface StudioTimelineEvent {
  id: string
  name: string
  categoryId?: string
  color?: string
  icon?: string
  timelinePosition: number  // ms where on timeline this event starts
  duration: number          // ms how long the event segment lasts
  trigger: 'manual' | 'vote'
  voteQuestion?: string
  voteOptions?: StudioVoteOption[]
}

/* ── Branching scenarios ── */

export interface StudioBranch {
  id: string
  name: string
  condition: 'vote_result' | 'manual' | 'time_elapsed'
  sourceEventId: string      // which event triggers this branch
  targetEventId: string      // which event to fire
  conditionValue?: string    // e.g., winning option ID for vote_result
  delay?: number             // ms delay before firing target
}

export interface StudioContent {
  canvas: {
    width: number
    height: number
    backgroundColor: string
  }
  layers: StudioLayer[]
  eventCategories: StudioEventCategory[]
  events: StudioEvent[]           // canonical event list with actions
  tracks?: StudioTrack[]          // timeline tracks (v2)
  timelineEvents?: StudioTimelineEvent[]  // @deprecated — use events[] instead
  totalDuration?: number          // ms (v2)
  branches?: StudioBranch[]       // branching scenarios
  votingEnabled: boolean
  description?: string
  image_url?: string
  cctvLayout?: '1' | '2' | '3' | '4' | '6' | '8'  // number of panels
  cctvSlots?: string[]  // array of slide IDs to show in each slot
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
  | StudioContent

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
