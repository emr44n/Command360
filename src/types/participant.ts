export interface Participant {
  id: string
  session_id: string
  display_name: string
  user_id: string | null
  score: number
  client_token: string
  joined_at: string
}

export interface LeaderboardEntry {
  participant_id: string
  display_name: string
  score: number
  rank: number
}

export interface QnAQuestion {
  id: string
  session_id: string
  slide_id: string
  participant_id: string
  question_text: string
  upvote_count: number
  is_answered: boolean
  is_hidden: boolean
  ai_suggested_answer: string | null
  created_at: string
}

export interface QnAUpvote {
  question_id: string
  participant_id: string
}
