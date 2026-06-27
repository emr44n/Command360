'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Shield, AlertTriangle, Flame, Radio, BookOpen, ClipboardList,
  HelpCircle, Users, Heart, BarChart2, Star, FileText,
  Search, ArrowRight, Loader2, Layers, Clock, Eye, X,
  Cloud, MessageCircle, AlignLeft, ChevronLeft, ChevronRight,
  Sparkles, Monitor, LayoutGrid, List, Trash2, Bookmark,
  FolderOpen, Plus, Pencil, MoreVertical, FolderInput,
  Briefcase, Zap, Target, Flag, Award, Lightbulb, Settings2,
} from 'lucide-react'

// ─── Template definitions ──────────────────────────────────────────────

interface TemplateSlide {
  slide_type: string
  title: string
  content: Record<string, unknown>
}

interface Template {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  category: string
  tags: string[]
  slides: TemplateSlide[]
  featured?: boolean
  estimatedMinutes?: number
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  poll: BarChart2, word_cloud: Cloud, quiz: HelpCircle, qna: MessageCircle,
  survey: ClipboardList, content: FileText, rating_scale: Star, open_text: AlignLeft,
  studio: Monitor,
}

const TYPE_COLORS: Record<string, string> = {
  poll: '#C9241A', word_cloud: '#3E6DC4', quiz: '#2E9E63', qna: '#c98a2a',
  survey: '#C9241A', content: '#9aa0a8', rating_scale: '#c98a2a', open_text: '#3E6DC4',
  studio: '#C9241A',
}

const TYPE_LABELS: Record<string, string> = {
  poll: 'Poll', word_cloud: 'Word Cloud', quiz: 'Quiz', qna: 'Q&A',
  survey: 'Survey', content: 'Content', rating_scale: 'Rating', open_text: 'Open Text',
  studio: 'Command Studio',
}

function estimateDuration(slides: TemplateSlide[]): number {
  return slides.reduce((total, s) => {
    switch (s.slide_type) {
      case 'content': return total + 1
      case 'poll': return total + 2
      case 'word_cloud': return total + 2
      case 'quiz': return total + 2
      case 'qna': return total + 5
      case 'survey': return total + 3
      case 'rating_scale': return total + 1
      case 'open_text': return total + 2
      case 'studio': return total + 5
      default: return total + 1
    }
  }, 0)
}

const TEMPLATES: Template[] = [
  // ── Briefings & Debriefs ──
  {
    id: 'safety-briefing',
    title: 'Safety Briefing',
    description: 'Pre-shift safety awareness check with hazard identification, PPE compliance, and knowledge quiz.',
    icon: Shield,
    color: 'text-[#C9241A] bg-[#C9241A]/10',
    category: 'Briefings & Debriefs',
    tags: ['safety', 'briefing', 'fire', 'police', 'ambulance'],
    featured: true,
    slides: [
      { slide_type: 'content', title: 'Safety Briefing', content: { body: 'Welcome to today\'s safety briefing. Please pay attention and participate in all interactive elements.', layout: 'text_only' } },
      { slide_type: 'poll', title: 'Have you completed your PPE check today?', content: { options: [{ id: '1', text: 'Yes — all checked' }, { id: '2', text: 'Partially' }, { id: '3', text: 'Not yet' }], allow_multiple: false, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'word_cloud', title: 'What hazards should we be aware of today?', content: { prompt: 'Name one hazard', max_words_per_person: 2, profanity_filter: true } },
      { slide_type: 'quiz', title: 'Fire extinguisher types', content: { options: [{ id: '1', text: 'Water (red label)', is_correct: false }, { id: '2', text: 'CO2 (black label)', is_correct: true }, { id: '3', text: 'Foam (cream label)', is_correct: false }, { id: '4', text: 'Powder (blue label)', is_correct: false }], time_limit_seconds: 20, points: 500, explanation: 'CO2 extinguishers with black labels are used for electrical fires.', shuffle_options: true } },
      { slide_type: 'rating_scale', title: 'How confident are you in emergency procedures?', content: { min_value: 1, max_value: 10, min_label: 'Not confident', max_label: 'Very confident', step: 1, show_average: true } },
      { slide_type: 'poll', title: 'Which area needs the most attention today?', content: { options: [{ id: '1', text: 'Slip/trip hazards' }, { id: '2', text: 'Manual handling' }, { id: '3', text: 'Vehicle movement' }, { id: '4', text: 'Electrical safety' }], allow_multiple: true, show_results_immediately: true, chart_type: 'bar' } },
      { slide_type: 'open_text', title: 'Any safety concerns to raise?', content: { placeholder: 'Describe any safety concerns...', max_length: 500, allow_multiple_submissions: false, show_responses_live: true } },
      { slide_type: 'content', title: 'Stay safe today', content: { body: 'Remember: if in doubt, stop and ask. Report all near-misses. Look after yourself and your team.', layout: 'text_only' } },
    ],
  },
  {
    id: 'incident-debrief',
    title: 'Incident Debrief',
    description: 'Structured post-incident debrief covering timeline, decisions, outcomes, and lessons learned.',
    icon: AlertTriangle,
    color: 'text-[#c98a2a] bg-[#c98a2a]/10',
    category: 'Briefings & Debriefs',
    tags: ['debrief', 'incident', 'review', 'lessons'],
    featured: true,
    slides: [
      { slide_type: 'content', title: 'Incident Debrief', content: { body: 'This debrief is a safe space for honest reflection. All responses help us improve our response capability.', layout: 'text_only' } },
      { slide_type: 'poll', title: 'How would you rate the overall response?', content: { options: [{ id: '1', text: 'Excellent' }, { id: '2', text: 'Good' }, { id: '3', text: 'Adequate' }, { id: '4', text: 'Needs improvement' }], allow_multiple: false, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'word_cloud', title: 'What went well?', content: { prompt: 'One thing that went well', max_words_per_person: 3, profanity_filter: true } },
      { slide_type: 'word_cloud', title: 'What could be improved?', content: { prompt: 'One area for improvement', max_words_per_person: 3, profanity_filter: true } },
      { slide_type: 'rating_scale', title: 'How effective was communication during the incident?', content: { min_value: 1, max_value: 10, min_label: 'Very poor', max_label: 'Excellent', step: 1, show_average: true } },
      { slide_type: 'poll', title: 'Were resources adequate for the incident?', content: { options: [{ id: '1', text: 'Yes, fully adequate' }, { id: '2', text: 'Mostly adequate' }, { id: '3', text: 'Some gaps' }, { id: '4', text: 'Significant shortfall' }], allow_multiple: false, show_results_immediately: true, chart_type: 'bar' } },
      { slide_type: 'open_text', title: 'What specific actions should we take?', content: { placeholder: 'Suggest a specific improvement action...', max_length: 500, allow_multiple_submissions: true, show_responses_live: true } },
      { slide_type: 'qna', title: 'Open discussion', content: { allow_anonymous_questions: true, upvotes_enabled: true, moderation_enabled: false } },
      { slide_type: 'rating_scale', title: 'Overall, how well prepared were we?', content: { min_value: 1, max_value: 10, min_label: 'Unprepared', max_label: 'Fully prepared', step: 1, show_average: true } },
      { slide_type: 'content', title: 'Next steps', content: { body: 'Action items from this debrief will be documented and tracked. Thank you for your honest input.', layout: 'text_only' } },
    ],
  },
  {
    id: 'hot-debrief',
    title: 'Hot Debrief',
    description: 'Quick 5-minute post-incident capture while details are fresh. Designed for immediate use on scene.',
    icon: Flame,
    color: 'text-[#c98a2a] bg-[#c98a2a]/10',
    category: 'Briefings & Debriefs',
    tags: ['debrief', 'quick', 'post-incident', 'immediate'],
    featured: true,
    slides: [
      { slide_type: 'rating_scale', title: 'How did we perform overall?', content: { min_value: 1, max_value: 5, min_label: 'Poor', max_label: 'Excellent', step: 1, show_average: true } },
      { slide_type: 'word_cloud', title: 'What went well?', content: { prompt: 'One word — what worked?', max_words_per_person: 2, profanity_filter: true } },
      { slide_type: 'word_cloud', title: 'What needs to change?', content: { prompt: 'One word — what to improve?', max_words_per_person: 2, profanity_filter: true } },
      { slide_type: 'open_text', title: 'Any immediate concerns?', content: { placeholder: 'Flag anything urgent...', max_length: 300, allow_multiple_submissions: false, show_responses_live: true } },
      { slide_type: 'poll', title: 'Do we need a full debrief?', content: { options: [{ id: '1', text: 'Yes, definitely' }, { id: '2', text: 'Maybe — let leadership decide' }, { id: '3', text: 'No, this is sufficient' }], allow_multiple: false, show_results_immediately: true, chart_type: 'horizontal_bar' } },
    ],
  },
  {
    id: 'shift-briefing',
    title: 'Shift Briefing',
    description: 'Standard shift handover covering key information, risk updates, and tasking assignments.',
    icon: Radio,
    color: 'text-[#3E6DC4] bg-[#3E6DC4]/10',
    category: 'Briefings & Debriefs',
    tags: ['shift', 'handover', 'briefing', 'daily'],
    slides: [
      { slide_type: 'content', title: 'Shift Briefing', content: { body: 'Good morning / afternoon. Here is today\'s briefing. Please pay attention and raise any questions.', layout: 'text_only' } },
      { slide_type: 'poll', title: 'Are you fit for duty today?', content: { options: [{ id: '1', text: 'Yes, fully fit' }, { id: '2', text: 'Minor issue but fit' }, { id: '3', text: 'Would like to discuss privately' }], allow_multiple: false, show_results_immediately: false, chart_type: 'horizontal_bar' } },
      { slide_type: 'quiz', title: 'Quick knowledge check', content: { options: [{ id: '1', text: 'Call control and wait for backup', is_correct: true }, { id: '2', text: 'Enter immediately alone', is_correct: false }, { id: '3', text: 'Leave the scene entirely', is_correct: false }, { id: '4', text: 'Contact family members', is_correct: false }], time_limit_seconds: 15, points: 500, explanation: 'Always call control and wait for backup before entering an unknown scene.', shuffle_options: true } },
      { slide_type: 'word_cloud', title: 'What risks are you aware of in your area?', content: { prompt: 'Name a local risk', max_words_per_person: 2, profanity_filter: true } },
      { slide_type: 'qna', title: 'Questions and concerns', content: { allow_anonymous_questions: true, upvotes_enabled: true, moderation_enabled: false } },
      { slide_type: 'content', title: 'Stay safe', content: { body: 'Dynamic risk assessment at every call. Look after each other. Report anything unusual.', layout: 'text_only' } },
    ],
  },

  // ── Training & Assessment ──
  {
    id: 'protocol-training',
    title: 'Protocol Training',
    description: 'Step-by-step protocol walkthrough with embedded knowledge checks and competency verification.',
    icon: BookOpen,
    color: 'text-[#2E9E63] bg-[#2E9E63]/10',
    category: 'Training & Assessment',
    tags: ['training', 'protocol', 'procedure', 'learning'],
    featured: true,
    slides: [
      { slide_type: 'content', title: 'Protocol Training', content: { body: 'Today we will review standard operating procedures. Pay close attention — there will be knowledge checks throughout.', layout: 'text_only' } },
      { slide_type: 'poll', title: 'How familiar are you with this protocol?', content: { options: [{ id: '1', text: 'Very familiar' }, { id: '2', text: 'Somewhat familiar' }, { id: '3', text: 'Not familiar' }, { id: '4', text: 'First time learning' }], allow_multiple: false, show_results_immediately: true, chart_type: 'bar' } },
      { slide_type: 'content', title: 'Step 1: Scene Assessment', content: { body: 'On arrival, conduct a 360-degree scene assessment. Identify hazards, access points, and resources needed.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'Knowledge check: Scene assessment', content: { options: [{ id: '1', text: '360-degree walkround', is_correct: true }, { id: '2', text: 'Immediate entry', is_correct: false }, { id: '3', text: 'Wait for instruction', is_correct: false }, { id: '4', text: 'Radio check only', is_correct: false }], time_limit_seconds: 15, points: 500, explanation: 'A full 360-degree walkround is essential before any action.', shuffle_options: true } },
      { slide_type: 'content', title: 'Step 2: Risk Assessment', content: { body: 'Apply dynamic risk assessment. Consider the risk to yourself, your team, and the public before committing to action.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'Knowledge check: Risk priorities', content: { options: [{ id: '1', text: 'Self, team, public', is_correct: true }, { id: '2', text: 'Public, team, self', is_correct: false }, { id: '3', text: 'Team, public, self', is_correct: false }, { id: '4', text: 'Property, public, self', is_correct: false }], time_limit_seconds: 15, points: 500, explanation: 'Risk priority order: yourself first, then your team, then the public.', shuffle_options: true } },
      { slide_type: 'content', title: 'Step 3: Communication', content: { body: 'Communicate situation report to control using METHANE format: Major incident, Exact location, Type of incident, Hazards, Access, Number of casualties, Emergency services.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'What does METHANE stand for?', content: { options: [{ id: '1', text: 'Major incident, Exact location, Type, Hazards, Access, Number, Emergency services', is_correct: true }, { id: '2', text: 'Medical, Emergency, Triage, Hazards, Assessment, Numbers, Equipment', is_correct: false }, { id: '3', text: 'Major, Equipment, Type, Hazards, Area, Numbers, Emergency', is_correct: false }], time_limit_seconds: 25, points: 1000, explanation: 'METHANE is the standard major incident reporting format.', shuffle_options: true } },
      { slide_type: 'rating_scale', title: 'How confident do you feel applying this protocol?', content: { min_value: 1, max_value: 10, min_label: 'Not confident', max_label: 'Fully confident', step: 1, show_average: true } },
      { slide_type: 'open_text', title: 'Any questions about the protocol?', content: { placeholder: 'Type your question...', max_length: 500, allow_multiple_submissions: true, show_responses_live: true } },
      { slide_type: 'survey', title: 'Training feedback', content: { questions: [{ id: '1', text: 'Was this training useful?', type: 'rating', required: true, rating_max: 5 }, { id: '2', text: 'Would you like more practice on this topic?', type: 'single_choice', required: true, options: [{ id: 'a', text: 'Yes' }, { id: 'b', text: 'No' }] }] } },
      { slide_type: 'content', title: 'Training complete', content: { body: 'Well done. Remember to review this protocol regularly and raise any concerns with your supervisor.', layout: 'text_only' } },
    ],
  },
  {
    id: 'equipment-check',
    title: 'Equipment Check',
    description: 'Equipment competency assessment covering identification, usage, and maintenance procedures.',
    icon: ClipboardList,
    color: 'text-[#6a5ea8] bg-[#6a5ea8]/10',
    category: 'Training & Assessment',
    tags: ['equipment', 'competency', 'assessment', 'check'],
    slides: [
      { slide_type: 'content', title: 'Equipment Competency Check', content: { body: 'This assessment will test your knowledge of standard equipment. Answer honestly — this helps us identify training needs.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'BA set pre-use checks', content: { options: [{ id: '1', text: 'Cylinder pressure, face seal, demand valve, comms', is_correct: true }, { id: '2', text: 'Just cylinder pressure', is_correct: false }, { id: '3', text: 'Visual inspection only', is_correct: false }, { id: '4', text: 'Whistle test only', is_correct: false }], time_limit_seconds: 20, points: 500, explanation: 'Full pre-use check includes cylinder pressure, face seal, demand valve function, and communications check.', shuffle_options: true } },
      { slide_type: 'quiz', title: 'Defibrillator pad placement', content: { options: [{ id: '1', text: 'Upper right chest and lower left ribs', is_correct: true }, { id: '2', text: 'Both on the chest centre', is_correct: false }, { id: '3', text: 'Both on the back', is_correct: false }, { id: '4', text: 'Upper left chest and lower right ribs', is_correct: false }], time_limit_seconds: 20, points: 500, explanation: 'Standard placement: one pad upper right chest, one pad lower left ribs (apex).', shuffle_options: true } },
      { slide_type: 'poll', title: 'Which equipment do you feel least confident with?', content: { options: [{ id: '1', text: 'Breathing apparatus' }, { id: '2', text: 'Hydraulic rescue tools' }, { id: '3', text: 'Defibrillator / AED' }, { id: '4', text: 'Radio communications' }], allow_multiple: true, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'rating_scale', title: 'Rate your overall equipment confidence', content: { min_value: 1, max_value: 10, min_label: 'Not confident', max_label: 'Fully competent', step: 1, show_average: true } },
      { slide_type: 'quiz', title: 'Correct lifting technique', content: { options: [{ id: '1', text: 'Bend knees, straight back, close to body', is_correct: true }, { id: '2', text: 'Bend at waist, legs straight', is_correct: false }, { id: '3', text: 'Arms extended, fast lift', is_correct: false }, { id: '4', text: 'Twist and pull', is_correct: false }], time_limit_seconds: 15, points: 500, explanation: 'Always bend knees, keep a straight back, and hold close to your body.', shuffle_options: true } },
      { slide_type: 'open_text', title: 'What equipment training would you like more of?', content: { placeholder: 'Tell us what equipment you want to train on...', max_length: 300, allow_multiple_submissions: false, show_responses_live: true } },
      { slide_type: 'content', title: 'Assessment complete', content: { body: 'Thank you for completing the equipment check. Results will be reviewed and any training needs addressed.', layout: 'text_only' } },
    ],
  },
  {
    id: 'knowledge-assessment',
    title: 'Knowledge Assessment',
    description: 'Scored knowledge quiz with multiple topics, instant results, and competency tracking.',
    icon: HelpCircle,
    color: 'text-[#3E6DC4] bg-[#3E6DC4]/10',
    category: 'Training & Assessment',
    tags: ['quiz', 'assessment', 'knowledge', 'scoring'],
    slides: [
      { slide_type: 'content', title: 'Knowledge Assessment', content: { body: 'This timed assessment covers core operational knowledge. Your scores will be recorded for CPD purposes.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'Q1: Incident command structure', content: { options: [{ id: '1', text: 'Strategic, Tactical, Operational', is_correct: true }, { id: '2', text: 'Command, Control, Communication', is_correct: false }, { id: '3', text: 'Bronze, Silver, Gold — top down', is_correct: false }], time_limit_seconds: 20, points: 500, explanation: 'UK incident command levels: Strategic (Gold), Tactical (Silver), Operational (Bronze).', shuffle_options: true } },
      { slide_type: 'quiz', title: 'Q2: JESIP principles', content: { options: [{ id: '1', text: 'Co-locate, communicate, coordinate, jointly understand risk, shared situational awareness', is_correct: true }, { id: '2', text: 'Just command and control', is_correct: false }, { id: '3', text: 'Each service works independently then reports', is_correct: false }], time_limit_seconds: 25, points: 500, explanation: 'JESIP (Joint Emergency Services Interoperability Principles) ensures multi-agency coordination.', shuffle_options: true } },
      { slide_type: 'quiz', title: 'Q3: Casualty triage — Priority 1 colour', content: { options: [{ id: '1', text: 'Red — immediate', is_correct: true }, { id: '2', text: 'Yellow — urgent', is_correct: false }, { id: '3', text: 'Green — delayed', is_correct: false }, { id: '4', text: 'Black — deceased', is_correct: false }], time_limit_seconds: 15, points: 500, explanation: 'Triage sieve: P1 Red = Immediate, P2 Yellow = Urgent, P3 Green = Delayed, Dead = Black.', shuffle_options: true } },
      { slide_type: 'quiz', title: 'Q4: Cordon distances', content: { options: [{ id: '1', text: 'Inner, outer, and traffic cordon', is_correct: true }, { id: '2', text: 'Just one cordon at 100m', is_correct: false }, { id: '3', text: 'No cordon needed for small incidents', is_correct: false }], time_limit_seconds: 20, points: 500, explanation: 'Three cordon levels: inner (hot zone), outer (warm zone), and traffic management.', shuffle_options: true } },
      { slide_type: 'quiz', title: 'Q5: Radio protocol — urgency message', content: { options: [{ id: '1', text: 'Priority — Priority — Priority', is_correct: true }, { id: '2', text: 'Urgent — Urgent — Urgent', is_correct: false }, { id: '3', text: 'Emergency — Emergency — Emergency', is_correct: false }, { id: '4', text: 'Mayday — Mayday — Mayday', is_correct: false }], time_limit_seconds: 15, points: 500, explanation: 'Priority message: "Priority, Priority, Priority" for urgent operational messages.', shuffle_options: true } },
      { slide_type: 'quiz', title: 'Q6: CBRN initial actions', content: { options: [{ id: '1', text: 'Remove, remove, remove — people, then decontaminate', is_correct: true }, { id: '2', text: 'Enter and investigate', is_correct: false }, { id: '3', text: 'Wait for specialist teams only', is_correct: false }], time_limit_seconds: 20, points: 1000, explanation: 'Initial CBRN response: remove casualties from the hot zone, then decontaminate. Do not enter without PPE.', shuffle_options: true } },
      { slide_type: 'rating_scale', title: 'How confident do you feel in your operational knowledge?', content: { min_value: 1, max_value: 10, min_label: 'Not confident', max_label: 'Very confident', step: 1, show_average: true } },
      { slide_type: 'content', title: 'Assessment complete', content: { body: 'Well done. Your results have been recorded. Review any questions you found difficult and speak to your supervisor about additional training.', layout: 'text_only' } },
    ],
  },
  {
    id: 'onboarding',
    title: 'New Starter Onboarding',
    description: 'Induction session for new starters covering key procedures, expectations, and introductions.',
    icon: Users,
    color: 'text-[#6a5ea8] bg-[#6a5ea8]/10',
    category: 'Training & Assessment',
    tags: ['onboarding', 'induction', 'new starter', 'welcome'],
    slides: [
      { slide_type: 'content', title: 'Welcome to the team', content: { body: 'Welcome! This induction covers the essentials you need to know. Feel free to ask questions at any time.', layout: 'text_only' } },
      { slide_type: 'word_cloud', title: 'Tell us about yourself in one word', content: { prompt: 'One word that describes you', max_words_per_person: 1, profanity_filter: true } },
      { slide_type: 'poll', title: 'What is your background?', content: { options: [{ id: '1', text: 'Transfer from another service' }, { id: '2', text: 'New to emergency services' }, { id: '3', text: 'Returning after a break' }, { id: '4', text: 'Other sector experience' }], allow_multiple: false, show_results_immediately: true, chart_type: 'bar' } },
      { slide_type: 'content', title: 'Our values', content: { body: 'Service, Courage, Integrity, Teamwork. These values guide everything we do. We hold ourselves and each other to the highest standards.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'Quick check: reporting line', content: { options: [{ id: '1', text: 'Your watch/team manager', is_correct: true }, { id: '2', text: 'The Chief Officer directly', is_correct: false }, { id: '3', text: 'Any available person', is_correct: false }], time_limit_seconds: 15, points: 250, explanation: 'Always report to your direct watch or team manager in the first instance.', shuffle_options: true } },
      { slide_type: 'content', title: 'Key procedures', content: { body: 'Familiarise yourself with: Station standing orders, Incident response protocols, Health & safety procedures, Reporting & recording systems.', layout: 'text_only' } },
      { slide_type: 'quiz', title: 'What do you do if you witness unsafe behaviour?', content: { options: [{ id: '1', text: 'Report it to your supervisor immediately', is_correct: true }, { id: '2', text: 'Ignore it', is_correct: false }, { id: '3', text: 'Post about it online', is_correct: false }, { id: '4', text: 'Wait until it causes an incident', is_correct: false }], time_limit_seconds: 15, points: 250, explanation: 'Always report unsafe behaviour immediately through the proper channels.', shuffle_options: true } },
      { slide_type: 'poll', title: 'What area would you like more information on?', content: { options: [{ id: '1', text: 'Operational procedures' }, { id: '2', text: 'Health & wellbeing support' }, { id: '3', text: 'Career development' }, { id: '4', text: 'Equipment & technology' }], allow_multiple: true, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'rating_scale', title: 'How prepared do you feel to start?', content: { min_value: 1, max_value: 10, min_label: 'Not at all ready', max_label: 'Fully ready', step: 1, show_average: true } },
      { slide_type: 'open_text', title: 'What questions do you have?', content: { placeholder: 'Ask us anything...', max_length: 500, allow_multiple_submissions: true, show_responses_live: true } },
      { slide_type: 'qna', title: 'Open Q&A', content: { allow_anonymous_questions: true, upvotes_enabled: true, moderation_enabled: false } },
      { slide_type: 'content', title: 'Welcome aboard', content: { body: 'We\'re glad to have you on the team. Your buddy/mentor will be in touch shortly. Don\'t hesitate to reach out with any questions.', layout: 'text_only' } },
    ],
  },

  // ── Wellbeing & Feedback ──
  {
    id: 'welfare-check',
    title: 'Welfare Check',
    description: 'Anonymous wellbeing survey for team welfare monitoring. Spot concerns early.',
    icon: Heart,
    color: 'text-[#C9241A] bg-[#C9241A]/10',
    category: 'Wellbeing & Feedback',
    tags: ['wellbeing', 'welfare', 'mental health', 'anonymous'],
    featured: true,
    slides: [
      { slide_type: 'content', title: 'Welfare Check-in', content: { body: 'This is a confidential welfare check. All responses are anonymous. Please answer honestly — your wellbeing matters to us.', layout: 'text_only' } },
      { slide_type: 'rating_scale', title: 'How are you feeling overall?', content: { min_value: 1, max_value: 10, min_label: 'Really struggling', max_label: 'Feeling great', step: 1, show_average: true } },
      { slide_type: 'rating_scale', title: 'How is your work-life balance?', content: { min_value: 1, max_value: 10, min_label: 'Very poor', max_label: 'Excellent', step: 1, show_average: true } },
      { slide_type: 'poll', title: 'Are you getting enough rest between shifts?', content: { options: [{ id: '1', text: 'Yes, well rested' }, { id: '2', text: 'Mostly, some tiredness' }, { id: '3', text: 'Struggling with fatigue' }, { id: '4', text: 'Seriously fatigued' }], allow_multiple: false, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'poll', title: 'Do you feel supported by your team?', content: { options: [{ id: '1', text: 'Very supported' }, { id: '2', text: 'Mostly supported' }, { id: '3', text: 'Could be better' }, { id: '4', text: 'Not supported' }], allow_multiple: false, show_results_immediately: true, chart_type: 'bar' } },
      { slide_type: 'open_text', title: 'Is there anything we can do to help?', content: { placeholder: 'Share anything on your mind (anonymous)...', max_length: 500, allow_multiple_submissions: false, show_responses_live: false } },
      { slide_type: 'content', title: 'Support available', content: { body: 'Remember: your mental health matters as much as physical fitness. Speak to your manager, occupational health, or the Employee Assistance Programme if you need support.', layout: 'text_only' } },
    ],
  },
  {
    id: 'team-feedback',
    title: 'Team Feedback',
    description: 'Collect anonymous feedback on team dynamics, leadership, and morale.',
    icon: Users,
    color: 'text-[#3E6DC4] bg-[#3E6DC4]/10',
    category: 'Wellbeing & Feedback',
    tags: ['feedback', 'team', 'leadership', 'morale'],
    slides: [
      { slide_type: 'content', title: 'Team Feedback Session', content: { body: 'Your honest feedback helps us build a stronger team. All responses are anonymous.', layout: 'text_only' } },
      { slide_type: 'rating_scale', title: 'How would you rate team morale?', content: { min_value: 1, max_value: 10, min_label: 'Very low', max_label: 'Excellent', step: 1, show_average: true } },
      { slide_type: 'rating_scale', title: 'How effective is communication within the team?', content: { min_value: 1, max_value: 10, min_label: 'Very poor', max_label: 'Excellent', step: 1, show_average: true } },
      { slide_type: 'word_cloud', title: 'What word describes our team culture?', content: { prompt: 'One word for our culture', max_words_per_person: 1, profanity_filter: true } },
      { slide_type: 'poll', title: 'Which area needs the most improvement?', content: { options: [{ id: '1', text: 'Communication' }, { id: '2', text: 'Training opportunities' }, { id: '3', text: 'Equipment/resources' }, { id: '4', text: 'Leadership support' }], allow_multiple: true, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'open_text', title: 'What one change would make the biggest difference?', content: { placeholder: 'Suggest one improvement...', max_length: 500, allow_multiple_submissions: false, show_responses_live: true } },
      { slide_type: 'survey', title: 'Quick survey', content: { questions: [{ id: '1', text: 'I feel valued as a team member', type: 'rating', required: true, rating_max: 5 }, { id: '2', text: 'I would recommend this team as a place to work', type: 'single_choice', required: true, options: [{ id: 'a', text: 'Strongly agree' }, { id: 'b', text: 'Agree' }, { id: 'c', text: 'Disagree' }, { id: 'd', text: 'Strongly disagree' }] }] } },
    ],
  },
  {
    id: 'training-evaluation',
    title: 'Training Evaluation',
    description: 'Post-training feedback form with rating scales, comments, and improvement suggestions.',
    icon: BarChart2,
    color: 'text-[#6a5ea8] bg-[#6a5ea8]/10',
    category: 'Wellbeing & Feedback',
    tags: ['evaluation', 'training', 'feedback', 'post-training'],
    slides: [
      { slide_type: 'rating_scale', title: 'How would you rate this training overall?', content: { min_value: 1, max_value: 10, min_label: 'Poor', max_label: 'Excellent', step: 1, show_average: true } },
      { slide_type: 'poll', title: 'Was the content relevant to your role?', content: { options: [{ id: '1', text: 'Very relevant' }, { id: '2', text: 'Mostly relevant' }, { id: '3', text: 'Somewhat relevant' }, { id: '4', text: 'Not relevant' }], allow_multiple: false, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'rating_scale', title: 'How effective was the trainer/facilitator?', content: { min_value: 1, max_value: 10, min_label: 'Ineffective', max_label: 'Outstanding', step: 1, show_average: true } },
      { slide_type: 'word_cloud', title: 'What was your key takeaway?', content: { prompt: 'Main thing you learned', max_words_per_person: 2, profanity_filter: true } },
      { slide_type: 'open_text', title: 'How could this training be improved?', content: { placeholder: 'Share your suggestions...', max_length: 500, allow_multiple_submissions: false, show_responses_live: true } },
    ],
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment Workshop',
    description: 'Collaborative risk identification and prioritisation session with team voting.',
    icon: AlertTriangle,
    color: 'text-[#C9241A] bg-[#C9241A]/10',
    category: 'Wellbeing & Feedback',
    tags: ['risk', 'assessment', 'workshop', 'collaborative'],
    slides: [
      { slide_type: 'content', title: 'Risk Assessment Workshop', content: { body: 'Today we will identify and prioritise risks together. Every perspective matters — please contribute openly.', layout: 'text_only' } },
      { slide_type: 'word_cloud', title: 'What risks concern you most?', content: { prompt: 'Name a risk', max_words_per_person: 3, profanity_filter: true } },
      { slide_type: 'poll', title: 'Which risk category is most pressing?', content: { options: [{ id: '1', text: 'Operational risk' }, { id: '2', text: 'Personnel / staffing risk' }, { id: '3', text: 'Equipment / infrastructure' }, { id: '4', text: 'External / environmental' }], allow_multiple: false, show_results_immediately: true, chart_type: 'bar' } },
      { slide_type: 'rating_scale', title: 'How well are we managing our top risks currently?', content: { min_value: 1, max_value: 10, min_label: 'Very poorly', max_label: 'Very well', step: 1, show_average: true } },
      { slide_type: 'open_text', title: 'What specific mitigation actions should we take?', content: { placeholder: 'Propose a risk mitigation action...', max_length: 500, allow_multiple_submissions: true, show_responses_live: true } },
      { slide_type: 'poll', title: 'How often should we review these risks?', content: { options: [{ id: '1', text: 'Weekly' }, { id: '2', text: 'Monthly' }, { id: '3', text: 'Quarterly' }, { id: '4', text: 'As needed' }], allow_multiple: false, show_results_immediately: true, chart_type: 'horizontal_bar' } },
      { slide_type: 'qna', title: 'Discussion & questions', content: { allow_anonymous_questions: true, upvotes_enabled: true, moderation_enabled: false } },
      { slide_type: 'content', title: 'Next steps', content: { body: 'All identified risks will be added to the risk register. Mitigation actions will be assigned and tracked. Thank you for your input.', layout: 'text_only' } },
    ],
  },
]

// ─── Default built-in categories ──────────────────────────────────────────────
const DEFAULT_CATEGORIES = ['Briefings & Debriefs', 'Training & Assessment', 'Wellbeing & Feedback']

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Briefings & Debriefs': Radio,
  'Training & Assessment': BookOpen,
  'Wellbeing & Feedback': Heart,
}

// ─── Preset icons for custom categories ──────────────────────────────────────
const PRESET_ICONS: { value: string; label: string; Icon: React.ElementType }[] = [
  { value: 'FolderOpen', label: 'Folder', Icon: FolderOpen },
  { value: 'Briefcase', label: 'Briefcase', Icon: Briefcase },
  { value: 'Zap', label: 'Zap', Icon: Zap },
  { value: 'Target', label: 'Target', Icon: Target },
  { value: 'Flag', label: 'Flag', Icon: Flag },
  { value: 'Award', label: 'Award', Icon: Award },
  { value: 'Lightbulb', label: 'Lightbulb', Icon: Lightbulb },
  { value: 'Star', label: 'Star', Icon: Star },
  { value: 'Shield', label: 'Shield', Icon: Shield },
  { value: 'Users', label: 'Users', Icon: Users },
  { value: 'BookOpen', label: 'Book', Icon: BookOpen },
  { value: 'Settings2', label: 'Settings', Icon: Settings2 },
]

function getPresetIcon(value: string): React.ElementType {
  return PRESET_ICONS.find((p) => p.value === value)?.Icon || FolderOpen
}

// ─── Custom category type ──────────────────────────────────────────────
interface CustomCategory {
  id: string
  name: string
  icon: string
}

interface UserTemplate {
  id: string
  title: string
  description: string
  updated_at: string
}

// ─── localStorage helpers ──────────────────────────────────────────────
function loadFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('c360-template-favorites') || '[]')
  } catch { return [] }
}

function saveFavorites(favs: string[]) {
  localStorage.setItem('c360-template-favorites', JSON.stringify(favs))
}

function loadCustomCategories(): CustomCategory[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('c360-template-categories') || '[]')
  } catch { return [] }
}

function saveCustomCategories(cats: CustomCategory[]) {
  localStorage.setItem('c360-template-categories', JSON.stringify(cats))
}

function loadCategoryMap(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('c360-template-category-map') || '{}')
  } catch { return {} }
}

function saveCategoryMap(map: Record<string, string>) {
  localStorage.setItem('c360-template-category-map', JSON.stringify(map))
}

// ─── Heart button component ──────────────────────────────────────────────
function HeartButton({ templateId, favorites, onToggle, className = '' }: {
  templateId: string
  favorites: string[]
  onToggle: (id: string) => void
  className?: string
}) {
  const isFav = favorites.includes(templateId)
  return (
    <Tooltip><TooltipTrigger asChild>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(templateId) }}
        className={`p-1.5 rounded-none transition-all hover:scale-110 ${className}`}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-[#C9241A] text-[#C9241A]' : 'text-muted-foreground hover:text-[#C9241A]'}`}
        />
      </button>
    </TooltipTrigger><TooltipContent>{isFav ? 'Remove from favourites' : 'Add to favourites'}</TooltipContent></Tooltip>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function TemplateGallery() {
  const router = useRouter()
  const [creating, setCreating] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [previewSlide, setPreviewSlide] = useState(0)
  const [view, setView] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('c360-view-mode') as 'grid' | 'list') || 'grid'
    }
    return 'grid'
  })
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([])
  const [loadingUserTemplates, setLoadingUserTemplates] = useState(true)
  const [deletingTemplate, setDeletingTemplate] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string; title: string } | null>(null)

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites())

  // Custom categories
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => loadCustomCategories())
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>(() => loadCategoryMap())

  // Manage categories dialog
  const [manageCatsOpen, setManageCatsOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('FolderOpen')
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [editCatName, setEditCatName] = useState('')

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      saveFavorites(next)
      return next
    })
  }

  // All categories (default + custom)
  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...customCategories.map((c) => c.name),
  ]

  // Category dropdown options
  const categoryOptions = ['All Templates', ...allCategories]

  useEffect(() => {
    async function fetchUserTemplates() {
      try {
        const res = await fetch('/api/templates')
        if (res.ok) {
          const data = await res.json()
          setUserTemplates(data.templates || [])
        }
      } catch {
        // silently fail
      } finally {
        setLoadingUserTemplates(false)
      }
    }
    fetchUserTemplates()
  }, [])

  function promptDeleteUserTemplate(id: string, title: string) {
    setTemplateToDelete({ id, title })
    setDeleteConfirmOpen(true)
  }

  async function handleDeleteUserTemplate() {
    if (!templateToDelete) return
    const { id } = templateToDelete
    setDeletingTemplate(id)
    setDeleteConfirmOpen(false)
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setUserTemplates((prev) => prev.filter((t) => t.id !== id))
        // Also remove from favorites and category map
        setFavorites((prev) => {
          const next = prev.filter((f) => f !== id)
          saveFavorites(next)
          return next
        })
        setCategoryMap((prev) => {
          const next = { ...prev }
          delete next[id]
          saveCategoryMap(next)
          return next
        })
        toast.success('Template deleted')
      } else {
        toast.error('Failed to delete template')
      }
    } catch {
      toast.error('Failed to delete template')
    } finally {
      setDeletingTemplate(null)
      setTemplateToDelete(null)
    }
  }

  async function handleUseUserTemplate(id: string) {
    setCreating(id)
    try {
      const res = await fetch(`/api/templates/${id}/use`, { method: 'POST' })
      if (!res.ok) {
        toast.error('Failed to create from template')
        setCreating(null)
        return
      }
      const data = await res.json()
      toast.success('Session created from template')
      router.push(`/presentations/${data.presentation.id}/edit`)
    } catch {
      toast.error('Something went wrong')
      setCreating(null)
    }
  }

  // Move template to category
  function moveToCategory(templateId: string, categoryName: string | null) {
    setCategoryMap((prev) => {
      const next = { ...prev }
      if (categoryName === null) {
        delete next[templateId]
      } else {
        next[templateId] = categoryName
      }
      saveCategoryMap(next)
      return next
    })
    toast.success(categoryName ? `Moved to ${categoryName}` : 'Removed from category')
  }

  // Custom category management
  function addCustomCategory() {
    if (!newCatName.trim()) return
    if (allCategories.includes(newCatName.trim())) {
      toast.error('Category already exists')
      return
    }
    const cat: CustomCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      icon: newCatIcon,
    }
    setCustomCategories((prev) => {
      const next = [...prev, cat]
      saveCustomCategories(next)
      return next
    })
    setNewCatName('')
    setNewCatIcon('FolderOpen')
    toast.success('Category created')
  }

  function renameCustomCategory(id: string) {
    if (!editCatName.trim()) return
    setCustomCategories((prev) => {
      const old = prev.find((c) => c.id === id)
      const oldName = old?.name
      const next = prev.map((c) => c.id === id ? { ...c, name: editCatName.trim() } : c)
      saveCustomCategories(next)
      // Update category map references
      if (oldName) {
        setCategoryMap((prevMap) => {
          const nextMap: Record<string, string> = {}
          for (const [k, v] of Object.entries(prevMap)) {
            nextMap[k] = v === oldName ? editCatName.trim() : v
          }
          saveCategoryMap(nextMap)
          return nextMap
        })
      }
      return next
    })
    setEditingCat(null)
    setEditCatName('')
    toast.success('Category renamed')
  }

  function deleteCustomCategory(id: string) {
    const cat = customCategories.find((c) => c.id === id)
    if (!cat) return
    setCustomCategories((prev) => {
      const next = prev.filter((c) => c.id !== id)
      saveCustomCategories(next)
      return next
    })
    // Move templates in that category to uncategorised
    setCategoryMap((prev) => {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (v !== cat.name) next[k] = v
      }
      saveCategoryMap(next)
      return next
    })
    if (activeCategory === cat.name) setActiveCategory('All')
    toast.success('Category deleted')
  }

  // Resolve the effective category for a built-in template
  function getEffectiveCategory(t: Template): string {
    return categoryMap[t.id] || t.category
  }

  const filteredUserTemplates = userTemplates.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
  })

  const selectedCategory = activeCategory === 'All' ? null : activeCategory

  const filtered = TEMPLATES.filter((t) => {
    const effectiveCat = getEffectiveCategory(t)
    const matchesCategory = !selectedCategory || effectiveCat === selectedCategory
    const matchesSearch =
      search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Group by effective category for display
  const displayCategories = selectedCategory
    ? [selectedCategory]
    : [...DEFAULT_CATEGORIES, ...customCategories.map((c) => c.name)]

  const grouped = displayCategories
    .map((cat) => ({
      category: cat,
      templates: filtered.filter((t) => getEffectiveCategory(t) === cat),
    }))
    .filter((g) => g.templates.length > 0)

  // Favourites: all template IDs (built-in + user) that are hearted
  const favBuiltIn = TEMPLATES.filter((t) => favorites.includes(t.id))
  const favUser = userTemplates.filter((t) => favorites.includes(t.id))
  const hasFavorites = favBuiltIn.length > 0 || favUser.length > 0

  const createFromTemplate = useCallback(async (template: Template) => {
    setCreating(template.id)
    try {
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: template.title, description: template.description }),
      })
      if (!res.ok) { toast.error('Failed to create session'); setCreating(null); return }
      const { presentation } = await res.json()

      for (let i = 0; i < template.slides.length; i++) {
        const s = template.slides[i]
        await fetch('/api/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ presentation_id: presentation.id, slide_type: s.slide_type, title: s.title, content: s.content, position: i }),
        })
      }

      toast.success(`"${template.title}" created with ${template.slides.length} slides`)
      router.push(`/presentations/${presentation.id}/edit`)
    } catch {
      toast.error('Something went wrong')
      setCreating(null)
    }
  }, [router])

  function openPreview(template: Template) {
    setPreviewTemplate(template)
    setPreviewSlide(0)
  }

  // Get icon for a category (built-in or custom)
  function getCategoryIcon(catName: string): React.ElementType | null {
    if (CATEGORY_ICONS[catName]) return CATEGORY_ICONS[catName]
    const custom = customCategories.find((c) => c.name === catName)
    if (custom) return getPresetIcon(custom.icon)
    return null
  }

  // ─── Move-to-category dropdown for template cards ──────────────
  function MoveToCategoryMenu({ templateId }: { templateId: string }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Tooltip><TooltipTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <FolderInput className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger><TooltipContent>Move to category</TooltipContent></Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel className="text-xs">Move to category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => moveToCategory(templateId, null)}>
            <X className="w-3 h-3 mr-2" /> Remove category
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {allCategories.map((cat) => {
            const CIcon = getCategoryIcon(cat)
            return (
              <DropdownMenuItem key={cat} onClick={() => moveToCategory(templateId, cat)}>
                {CIcon && <CIcon className="w-3 h-3 mr-2" />}
                {cat}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search + Category dropdown + View toggle — all in one row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="pl-9 bg-background border-border text-sm"
          />
        </div>

        {/* Category dropdown */}
        <Select
          value={activeCategory === 'All' ? 'All Templates' : activeCategory}
          onValueChange={(val) => setActiveCategory(val === 'All Templates' ? 'All' : val)}
        >
          <SelectTrigger className="w-[220px] text-sm">
            <SelectValue placeholder="All Templates" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Manage Categories button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs shrink-0"
          onClick={() => setManageCatsOpen(true)}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Manage Categories
        </Button>

        {/* View toggle */}
        <div className="flex items-center rounded-none border border-border overflow-hidden shrink-0">
          <button
            onClick={() => { setView('grid'); localStorage.setItem('c360-view-mode', 'grid') }}
            className={`p-2 transition-all duration-200 ${
              view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setView('list'); localStorage.setItem('c360-view-mode', 'list') }}
            className={`p-2 transition-all duration-200 ${
              view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Favourites section ─── */}
      {hasFavorites && !search && activeCategory === 'All' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-[#C9241A] fill-[#C9241A]" />
            <h3 className="text-sm font-semibold text-foreground">Favourites</h3>
            <span className="text-xs text-muted-foreground">({favBuiltIn.length + favUser.length})</span>
          </div>
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'space-y-2'}>
            {/* Fav built-in */}
            {favBuiltIn.map((t) => (
              view === 'grid'
                ? <BuiltInGridCard key={t.id} t={t} creating={creating} createFromTemplate={createFromTemplate} openPreview={openPreview} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
                : <BuiltInListCard key={t.id} t={t} creating={creating} createFromTemplate={createFromTemplate} openPreview={openPreview} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
            ))}
            {/* Fav user templates */}
            {favUser.map((t) => (
              view === 'grid'
                ? <UserGridCard key={t.id} t={t} creating={creating} deletingTemplate={deletingTemplate} handleUseUserTemplate={handleUseUserTemplate} promptDeleteUserTemplate={promptDeleteUserTemplate} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
                : <UserListCard key={t.id} t={t} creating={creating} deletingTemplate={deletingTemplate} handleUseUserTemplate={handleUseUserTemplate} promptDeleteUserTemplate={promptDeleteUserTemplate} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
            ))}
          </div>
        </div>
      )}

      {/* ─── User-saved templates ─── */}
      {(activeCategory === 'All') && filteredUserTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">My Templates</h3>
            <span className="text-xs text-muted-foreground">({filteredUserTemplates.length})</span>
          </div>
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'space-y-2'}>
            {filteredUserTemplates.map((t) => (
              view === 'grid'
                ? <UserGridCard key={t.id} t={t} creating={creating} deletingTemplate={deletingTemplate} handleUseUserTemplate={handleUseUserTemplate} promptDeleteUserTemplate={promptDeleteUserTemplate} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
                : <UserListCard key={t.id} t={t} creating={creating} deletingTemplate={deletingTemplate} handleUseUserTemplate={handleUseUserTemplate} promptDeleteUserTemplate={promptDeleteUserTemplate} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Built-in template groups ─── */}
      {filtered.length === 0 && filteredUserTemplates.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No templates match your search</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="text-primary text-xs mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      ) : view === 'grid' ? (
        grouped.map((group) => {
          const CatIcon = getCategoryIcon(group.category)
          return (
            <div key={group.category}>
              {activeCategory === 'All' && (
                <div className="flex items-center gap-2 mb-3">
                  {CatIcon && <CatIcon className="w-4 h-4 text-muted-foreground" />}
                  <h3 className="text-sm font-semibold text-foreground">{group.category}</h3>
                  <span className="text-xs text-muted-foreground">({group.templates.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {group.templates.map((t) => (
                  <BuiltInGridCard key={t.id} t={t} creating={creating} createFromTemplate={createFromTemplate} openPreview={openPreview} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        grouped.map((group) => {
          const CatIcon = getCategoryIcon(group.category)
          return (
            <div key={group.category}>
              {activeCategory === 'All' && (
                <div className="flex items-center gap-2 mb-3">
                  {CatIcon && <CatIcon className="w-4 h-4 text-muted-foreground" />}
                  <h3 className="text-sm font-semibold text-foreground">{group.category}</h3>
                  <span className="text-xs text-muted-foreground">({group.templates.length})</span>
                </div>
              )}
              <div className="space-y-2 mb-6">
                {group.templates.map((t) => (
                  <BuiltInListCard key={t.id} t={t} creating={creating} createFromTemplate={createFromTemplate} openPreview={openPreview} favorites={favorites} toggleFavorite={toggleFavorite} MoveToCategoryMenu={MoveToCategoryMenu} />
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* ─── Delete confirmation dialog ─── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{templateToDelete?.title}&rdquo;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUserTemplate}>
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Manage Categories dialog ─── */}
      <Dialog open={manageCatsOpen} onOpenChange={setManageCatsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Create custom categories to organise your templates. Default categories cannot be modified.
            </DialogDescription>
          </DialogHeader>

          {/* Default categories (read-only) */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Default</p>
            {DEFAULT_CATEGORIES.map((cat) => {
              const CIcon = CATEGORY_ICONS[cat]
              return (
                <div key={cat} className="flex items-center gap-3 px-3 py-2 rounded-none bg-muted/50">
                  {CIcon && <CIcon className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm text-foreground">{cat}</span>
                </div>
              )
            })}
          </div>

          {/* Custom categories */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom</p>
            {customCategories.length === 0 && (
              <p className="text-xs text-muted-foreground py-2">No custom categories yet.</p>
            )}
            {customCategories.map((cat) => {
              const CIcon = getPresetIcon(cat.icon)
              return (
                <div key={cat.id} className="flex items-center gap-3 px-3 py-2 rounded-none bg-muted/50">
                  <CIcon className="w-4 h-4 text-muted-foreground" />
                  {editingCat === cat.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="h-7 text-sm flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && renameCustomCategory(cat.id)}
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => renameCustomCategory(cat.id)}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingCat(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm text-foreground flex-1">{cat.name}</span>
                      <button onClick={() => { setEditingCat(cat.id); setEditCatName(cat.name) }} className="p-1 text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => deleteCustomCategory(cat.id)} className="p-1 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add new category */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Add category</p>
            <div className="flex gap-2 items-end">
              {/* Icon picker */}
              <div className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 rounded-none border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      {(() => { const I = getPresetIcon(newCatIcon); return <I className="w-4 h-4 text-muted-foreground" /> })()}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="grid grid-cols-4 gap-1 p-2 w-auto">
                    {PRESET_ICONS.map((p) => (
                      <Tooltip><TooltipTrigger asChild>
                        <button
                          key={p.value}
                          onClick={() => setNewCatIcon(p.value)}
                          className={`w-8 h-8 rounded-none flex items-center justify-center transition-colors ${newCatIcon === p.value ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                          <p.Icon className="w-4 h-4" />
                        </button>
                      </TooltipTrigger><TooltipContent>{p.label}</TooltipContent></Tooltip>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name..."
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addCustomCategory()}
              />
              <Button size="sm" onClick={addCustomCategory} disabled={!newCatName.trim()}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Preview Modal ─── */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-background rounded-none w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-border"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-none flex items-center justify-center ${previewTemplate.color}`}>
                  <previewTemplate.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{previewTemplate.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {previewTemplate.slides.length} slides · ~{estimateDuration(previewTemplate.slides)} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HeartButton templateId={previewTemplate.id} favorites={favorites} onToggle={toggleFavorite} />
                <Button
                  size="sm"
                  className="gap-1.5 rounded-none text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => createFromTemplate(previewTemplate)}
                  disabled={creating !== null}
                >
                  {creating === previewTemplate.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                  Use template
                </Button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide preview area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Slide list */}
              <div className="w-52 border-r border-border overflow-y-auto p-2 shrink-0 bg-muted/30">
                {previewTemplate.slides.map((s, i) => {
                  const TypeIcon = TYPE_ICONS[s.slide_type] || FileText
                  const color = TYPE_COLORS[s.slide_type] || '#6b7280'
                  return (
                    <button
                      key={i}
                      onClick={() => setPreviewSlide(i)}
                      className={`w-full text-left p-2.5 rounded-none mb-1 transition-all ${
                        previewSlide === i
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                        <TypeIcon style={{ width: 11, height: 11, color }} />
                        <span style={{ color }} className="text-[9px] font-semibold uppercase">
                          {TYPE_LABELS[s.slide_type] || s.slide_type}
                        </span>
                      </div>
                      <p className="text-xs text-foreground font-medium truncate pl-6">{s.title}</p>
                    </button>
                  )
                })}
              </div>

              {/* Slide content preview */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center bg-muted/10">
                <div className="w-full max-w-lg bg-white rounded-none border border-border shadow-sm overflow-hidden relative aspect-video" style={{ aspectRatio: '16/9' }}>
                  <div className="absolute inset-0 flex flex-col p-6">
                    {/* Type badge */}
                    <div className="flex items-center gap-1.5 mb-3 shrink-0">
                      {(() => {
                        const s = previewTemplate.slides[previewSlide]
                        const TypeIcon = TYPE_ICONS[s.slide_type] || FileText
                        const color = TYPE_COLORS[s.slide_type] || '#6b7280'
                        return (
                          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-none" style={{ background: `${color}15`, color }}>
                            <TypeIcon style={{ width: 10, height: 10 }} />
                            {TYPE_LABELS[s.slide_type] || s.slide_type}
                          </span>
                        )
                      })()}
                    </div>
                    {/* Title */}
                    <h4 className="font-bold text-gray-900 text-lg mb-2 shrink-0">
                      {previewTemplate.slides[previewSlide].title}
                    </h4>
                    {/* Simple content preview */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
                      <div className="w-full">
                        <TemplateSlidePreview slide={previewTemplate.slides[previewSlide]} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setPreviewSlide(p => Math.max(0, p - 1))}
                    disabled={previewSlide === 0}
                    className="p-1.5 rounded-none text-muted-foreground hover:text-foreground disabled:opacity-30 hover:bg-muted transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-muted-foreground font-medium">
                    {previewSlide + 1} / {previewTemplate.slides.length}
                  </span>
                  <button
                    onClick={() => setPreviewSlide(p => Math.min(previewTemplate!.slides.length - 1, p + 1))}
                    disabled={previewSlide === previewTemplate.slides.length - 1}
                    className="p-1.5 rounded-none text-muted-foreground hover:text-foreground disabled:opacity-30 hover:bg-muted transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Built-in template grid card ──────────────────────────────────────────────
function BuiltInGridCard({ t, creating, createFromTemplate, openPreview, favorites, toggleFavorite, MoveToCategoryMenu }: {
  t: Template
  creating: string | null
  createFromTemplate: (t: Template) => void
  openPreview: (t: Template) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  MoveToCategoryMenu: React.ComponentType<{ templateId: string }>
}) {
  const duration = estimateDuration(t.slides)
  const uniqueTypes = [...new Set(t.slides.map(s => s.slide_type))]
  return (
    <div
      className="bg-card border border-border rounded-none p-5 hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer"
      onClick={() => openPreview(t)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${t.color} group-hover:scale-110 transition-transform duration-200`}>
          <t.icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
            {t.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
            <span>{t.slides.length} slides</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~{duration} min</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <HeartButton templateId={t.id} favorites={favorites} onToggle={toggleFavorite} />
          <MoveToCategoryMenu templateId={t.id} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {t.description}
      </p>

      {/* Slide type pills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {uniqueTypes.slice(0, 4).map((type) => {
          const TypeIcon = TYPE_ICONS[type] || FileText
          const color = TYPE_COLORS[type] || '#6b7280'
          return (
            <span key={type} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              <TypeIcon style={{ width: 9, height: 9, color }} />
              {TYPE_LABELS[type] || type}
            </span>
          )
        })}
        {uniqueTypes.length > 4 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            +{uniqueTypes.length - 4}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 flex-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); openPreview(t) }}
        >
          <Eye className="w-3 h-3" />
          Preview
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 flex-1 rounded-none text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
          onClick={(e) => { e.stopPropagation(); createFromTemplate(t) }}
          disabled={creating !== null}
        >
          {creating === t.id ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Creating...</>
          ) : (
            <>Use <ArrowRight className="w-3 h-3" /></>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Built-in template list card ──────────────────────────────────────────────
function BuiltInListCard({ t, creating, createFromTemplate, openPreview, favorites, toggleFavorite, MoveToCategoryMenu }: {
  t: Template
  creating: string | null
  createFromTemplate: (t: Template) => void
  openPreview: (t: Template) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  MoveToCategoryMenu: React.ComponentType<{ templateId: string }>
}) {
  const duration = estimateDuration(t.slides)
  const uniqueTypes = [...new Set(t.slides.map(s => s.slide_type))]
  return (
    <div className="group relative flex items-center gap-4 bg-card border border-border rounded-none p-4 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5">
      <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${t.color}`}>
        <t.icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors truncate">{t.title}</h4>
          {t.featured && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-[#c98a2a]/10 text-[#c98a2a] shrink-0">Popular</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span>{t.slides.length} slides</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~{duration} min</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            {uniqueTypes.slice(0, 3).map((type) => {
              const TypeIcon = TYPE_ICONS[type] || FileText
              const color = TYPE_COLORS[type] || '#6b7280'
              return <Tooltip key={type}><TooltipTrigger asChild><span style={{ display: 'inline-flex' }}><TypeIcon style={{ width: 11, height: 11, color }} /></span></TooltipTrigger><TooltipContent>{TYPE_LABELS[type] || type}</TooltipContent></Tooltip>
            })}
            {uniqueTypes.length > 3 && <span className="text-[10px]">+{uniqueTypes.length - 3}</span>}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <HeartButton templateId={t.id} favorites={favorites} onToggle={toggleFavorite} />
        <MoveToCategoryMenu templateId={t.id} />
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => openPreview(t)}
        >
          <Eye className="w-3 h-3" /> Preview
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs rounded-none"
          onClick={() => createFromTemplate(t)}
          disabled={creating !== null}
        >
          {creating === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Use <ArrowRight className="w-3 h-3" /></>}
        </Button>
      </div>
    </div>
  )
}

// ─── User template grid card ──────────────────────────────────────────────
function UserGridCard({ t, creating, deletingTemplate, handleUseUserTemplate, promptDeleteUserTemplate, favorites, toggleFavorite, MoveToCategoryMenu }: {
  t: UserTemplate
  creating: string | null
  deletingTemplate: string | null
  handleUseUserTemplate: (id: string) => void
  promptDeleteUserTemplate: (id: string, title: string) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  MoveToCategoryMenu: React.ComponentType<{ templateId: string }>
}) {
  return (
    <div className="bg-card border border-border rounded-none p-5 hover:shadow-md hover:border-primary/20 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-none flex items-center justify-center shrink-0 text-primary bg-primary/10 group-hover:scale-110 transition-transform duration-200">
          <Bookmark className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
            {t.title}
          </h4>
          {t.description && (
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{t.description.replace(/^\[TEMPLATE\]\s*/, '')}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <HeartButton templateId={t.id} favorites={favorites} onToggle={toggleFavorite} />
          <MoveToCategoryMenu templateId={t.id} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 flex-1 rounded-none text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
          onClick={() => handleUseUserTemplate(t.id)}
          disabled={creating !== null}
        >
          {creating === t.id ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Creating...</>
          ) : (
            <>Use <ArrowRight className="w-3 h-3" /></>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
          onClick={() => promptDeleteUserTemplate(t.id, t.title)}
          disabled={deletingTemplate === t.id}
        >
          {deletingTemplate === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  )
}

// ─── User template list card ──────────────────────────────────────────────
function UserListCard({ t, creating, deletingTemplate, handleUseUserTemplate, promptDeleteUserTemplate, favorites, toggleFavorite, MoveToCategoryMenu }: {
  t: UserTemplate
  creating: string | null
  deletingTemplate: string | null
  handleUseUserTemplate: (id: string) => void
  promptDeleteUserTemplate: (id: string, title: string) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  MoveToCategoryMenu: React.ComponentType<{ templateId: string }>
}) {
  return (
    <div className="group relative flex items-center gap-4 bg-card border border-border rounded-none p-4 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5">
      <div className="w-10 h-10 rounded-none flex items-center justify-center shrink-0 text-primary bg-primary/10">
        <Bookmark className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors truncate">{t.title}</h4>
        {t.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.description.replace(/^\[TEMPLATE\]\s*/, '')}</p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <HeartButton templateId={t.id} favorites={favorites} onToggle={toggleFavorite} />
        <MoveToCategoryMenu templateId={t.id} />
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs rounded-none"
          onClick={() => handleUseUserTemplate(t.id)}
          disabled={creating !== null}
        >
          {creating === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Use <ArrowRight className="w-3 h-3" /></>}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-muted-foreground hover:text-destructive"
          onClick={() => promptDeleteUserTemplate(t.id, t.title)}
          disabled={deletingTemplate === t.id}
        >
          {deletingTemplate === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  )
}

/* ─── Template Slide Preview (simplified) ─────────────────────────────── */

function TemplateSlidePreview({ slide }: { slide: TemplateSlide }) {
  const content = slide.content as Record<string, unknown>

  switch (slide.slide_type) {
    case 'poll': {
      const options = (content.options || []) as Array<{ text: string }>
      return (
        <div className="space-y-2">
          {options.map((o, i) => (
            <div key={i} className="bg-muted rounded-none px-3 py-2 text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-muted-foreground/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {o.text}
            </div>
          ))}
        </div>
      )
    }
    case 'quiz': {
      const options = (content.options || []) as Array<{ text: string; is_correct: boolean }>
      return (
        <div className="grid grid-cols-2 gap-2">
          {options.map((o, i) => (
            <div key={i} className={`rounded-none px-3 py-2 text-xs font-medium text-center ${o.is_correct ? 'bg-[#2E9E63]/10 text-[#2E9E63] border border-[#2E9E63]/30' : 'bg-muted text-foreground'}`}>
              {o.text} {o.is_correct && '\u2713'}
            </div>
          ))}
        </div>
      )
    }
    case 'word_cloud':
      return (
        <div className="text-center py-4 text-muted-foreground">
          <Cloud className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{(content.prompt as string) || 'Participants type words here'}</p>
        </div>
      )
    case 'rating_scale':
      return (
        <div className="py-2">
          <div className="flex justify-center gap-1.5 mb-2">
            {Array.from({ length: Math.min(((content.max_value as number) || 10) - ((content.min_value as number) || 1) + 1, 10) }, (_, i) => (
              <div key={i} className="w-8 h-8 rounded-none bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {((content.min_value as number) || 1) + i}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>{(content.min_label as string) || 'Low'}</span>
            <span>{(content.max_label as string) || 'High'}</span>
          </div>
        </div>
      )
    case 'open_text':
      return (
        <div className="border-2 border-dashed border-border rounded-none px-3 py-2 text-sm text-muted-foreground">
          {(content.placeholder as string) || 'Type your response here...'}
        </div>
      )
    case 'content':
      return (
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {(content.body as string) || 'No content'}
        </p>
      )
    case 'survey': {
      const questions = (content.questions || []) as Array<{ text: string }>
      return (
        <div className="space-y-1.5">
          {questions.slice(0, 3).map((q, i) => (
            <div key={i} className="bg-muted rounded-none px-3 py-2 text-sm text-foreground">
              {i + 1}. {q.text}
            </div>
          ))}
          {questions.length > 3 && <p className="text-xs text-muted-foreground text-center">+{questions.length - 3} more</p>}
        </div>
      )
    }
    case 'qna':
      return (
        <div className="text-center py-4 text-muted-foreground">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Audience submits questions</p>
          <p className="text-xs mt-1 opacity-60">Upvote and moderate in real time</p>
        </div>
      )
    default:
      return <p className="text-sm text-muted-foreground">Interactive slide</p>
  }
}
