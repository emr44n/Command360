/**
 * News / blog content model + mock data.
 *
 * This is the front-of-house "News" section. For now the posts below are
 * hand-authored mock content so the section, listing and article pages are
 * fully navigable; the back-end admin editor (Gemini-assisted drafting,
 * image/video uploads, RSS ingestion) will populate this same shape later.
 *
 * A post is a hero + an ordered list of content blocks (heading / text /
 * image / video / quote), so an article can interleave media and copy the way
 * the editor is intended to — "add a section, add a video, add an image,
 * then text underneath".
 */

export type NewsBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; youtube: string; caption?: string }
  | { type: 'quote'; text: string; attribution?: string }

export interface NewsPost {
  slug: string
  title: string
  /** ~155-char meta/summary used for cards + SEO description */
  excerpt: string
  category: string
  /** ISO date */
  date: string
  readingMinutes: number
  author: string
  /** card + hero image */
  heroImage: string
  /** accent hex for the category chip + hero glow */
  accent: string
  /** SEO keywords for the article */
  keywords: string[]
  blocks: NewsBlock[]
}

/**
 * External "industry feed" items — a stand-in for the live RSS feed of
 * incident-command news that will be ingested from sources across the UK
 * blue-light and resilience community. Shown as a sidebar/strip on /news.
 */
export interface FeedItem {
  title: string
  source: string
  date: string
  url: string
}

export const NEWS_CATEGORIES = [
  'Incident Command',
  'Multi-Agency',
  'Product',
  'Training Science',
  'Case Study',
] as const

export const NEWS_POSTS: NewsPost[] = [
  {
    slug: 'why-scenario-based-command-training-sticks',
    title: 'Why scenario-based command training sticks — and slide decks don’t',
    excerpt:
      'Commanders remember the decisions they make under pressure, not the bullet points they’re shown. Here’s the learning science behind immersive incident-command training.',
    category: 'Training Science',
    date: '2026-06-24',
    readingMinutes: 6,
    author: 'Command 360 Editorial',
    heroImage: '/solutions/all-services.webp',
    accent: '#C9241A',
    keywords: [
      'incident command training',
      'scenario based training',
      'decision making under pressure',
      'blue light training',
      'emergency services learning',
    ],
    blocks: [
      {
        type: 'text',
        text: 'Ask any experienced commander what made a training day stick, and they rarely point to a slide. They point to a moment — the call they had to make when the picture was incomplete, the resource they committed too early, the hand-over that went wrong. Decisions made under realistic pressure are encoded far more deeply than information that is simply presented. That single observation is the foundation of everything Command 360 is built to do.',
      },
      { type: 'heading', text: 'The problem with passive briefings' },
      {
        type: 'text',
        text: 'Conventional briefings are one-directional. A trainer talks; a room listens. Within days, most of the detail is gone — the well-documented "forgetting curve" sees unused information drop away rapidly unless it is actively retrieved and applied. For a discipline where the cost of a forgotten principle can be measured in lives, passive delivery is a poor fit. The issue is not the content. It is that recall is weak when the learner never has to *do* anything with it.',
      },
      {
        type: 'image',
        src: '/solutions/fire-rescue.webp',
        alt: 'Fire and rescue commanders working through a live incident scenario',
        caption: 'Crews work a developing scenario together rather than watching it described.',
      },
      { type: 'heading', text: 'Active decisions build durable memory' },
      {
        type: 'text',
        text: 'When a learner has to assess a situation, weigh options and commit to an action — then see the consequences play out — they engage retrieval, judgement and feedback in a single loop. This is the active, immersive learning that decades of cognitive research consistently rank above lecture-style delivery for retention and transfer. It is also closer to how the job actually feels: incomplete information, competing priorities, and a clock that does not stop.',
      },
      {
        type: 'quote',
        text: 'People remember what they do, not what they’re told. The closer training feels to the real decision, the longer it lasts.',
        attribution: 'Command 360',
      },
      { type: 'heading', text: 'Safe repetition of rare, high-stakes events' },
      {
        type: 'text',
        text: 'The incidents that test commanders most are, by definition, rare. A responder might go an entire career without facing a particular high-risk scenario for real — yet must be ready for it on the day. Scenario-based training lets teams rehearse those low-frequency, high-consequence events safely and repeatedly, building pattern recognition and confidence that a one-off lecture never could.',
      },
      {
        type: 'text',
        text: 'None of this requires a headset or a simulator suite. Command 360 brings immersive, decision-led training into any room with the screens and devices a service already has — so the engagement of a high-end exercise is available for an ordinary Tuesday refresher.',
      },
    ],
  },
  {
    slug: 'jesip-and-the-shared-picture',
    title: 'JESIP and the shared picture: training agencies to see the same incident',
    excerpt:
      'Major incidents are never handled by one service alone. We look at how joint training builds the shared situational awareness that effective multi-agency response depends on.',
    category: 'Multi-Agency',
    date: '2026-06-17',
    readingMinutes: 7,
    author: 'Command 360 Editorial',
    heroImage: '/solutions/civil-contingencies.webp',
    accent: '#3E6DC4',
    keywords: [
      'JESIP',
      'multi agency training',
      'joint decision model',
      'interoperability',
      'shared situational awareness',
    ],
    blocks: [
      {
        type: 'text',
        text: 'The Joint Emergency Services Interoperability Principles exist because the hardest part of a major incident is rarely any single service’s own task — it is the seams between them. Co-location, communication, co-ordination, joint understanding of risk, and shared situational awareness are the principles that turn three separate responses into one. They are also, notably, things you cannot learn from a document. They have to be practised.',
      },
      { type: 'heading', text: 'One scenario, every agency' },
      {
        type: 'text',
        text: 'When fire, police, ambulance and partner agencies train on the same evolving scenario at the same time, each can see how its actions ripple into the others. The ambulance commander’s casualty-clearing decision changes the cordon the police are holding; the fire sector’s tactic changes the access the ambulance service needs. Training them together — rather than in isolation — is the only way to rehearse the co-ordination JESIP describes.',
      },
      {
        type: 'image',
        src: '/solutions/police.webp',
        alt: 'Multi-agency commanders co-ordinating during a joint exercise',
        caption: 'Each agency sees the same developing picture and how its decisions affect the others.',
      },
      { type: 'heading', text: 'Bronze, Silver and Gold in the same room' },
      {
        type: 'text',
        text: 'Real command structures span operational, tactical and strategic levels. A scenario that can be scaled across Bronze, Silver and Gold lets commanders at every level train against the same incident, rehearsing the hand-overs and the upward and downward flow of information that so often determine how well a response holds together.',
      },
      {
        type: 'quote',
        text: 'Shared situational awareness isn’t a slogan — it’s the moment every agency in the room is genuinely looking at the same incident.',
      },
      { type: 'heading', text: 'Decisions that stand up afterwards' },
      {
        type: 'text',
        text: 'Joint training is also where defensible decision-making is built. Capturing the decisions teams make — and the reasoning behind them — lets commanders practise the clear, accountable thinking that has to stand up to scrutiny long after the event. Command 360 is designed to make those decisions visible and recordable, so a debrief becomes evidence of competence, not just a conversation.',
      },
    ],
  },
  {
    slug: 'command-studio-build-your-own-scenarios',
    title: 'Command Studio: build your own scenarios, your own way',
    excerpt:
      'A first look at Command Studio — the scenario builder that turns your risks, stations and procedures into layered, interactive incidents your teams can train against.',
    category: 'Product',
    date: '2026-06-10',
    readingMinutes: 5,
    author: 'Command 360 Team',
    heroImage: '/command-studio/cs-1.webp',
    accent: '#C9241A',
    keywords: [
      'Command Studio',
      'scenario builder',
      'bespoke training scenarios',
      'incident simulation',
      'emergency training software',
    ],
    blocks: [
      {
        type: 'text',
        text: 'No two services train the same way, so no two should be stuck with the same off-the-shelf scenarios. Command Studio is our scenario builder — a canvas where you compose incidents from layered imagery, timed events and live audience interaction, mapped to your own risks, your own stations and your own standard operating procedures.',
      },
      { type: 'heading', text: 'Layers, events and live decisions' },
      {
        type: 'text',
        text: 'Build a scene the way a designer would: drop in imagery and media as layers, then script events that change the picture over time — fire spread, a casualty deteriorating, a new agency arriving. Put decision points in front of participants live, branch the scenario on what they choose, and drive the whole exercise from a single control view.',
      },
      {
        type: 'video',
        youtube: 'dQw4w9WgXcQ',
        caption: 'Walkthrough: composing a multi-layer scene in Command Studio (placeholder).',
      },
      { type: 'heading', text: 'From your material, not ours' },
      {
        type: 'text',
        text: 'Bring existing briefings, policies and media into Command Studio and turn static documents into sessions your teams take part in. Every run produces a debrief — surfacing knowledge gaps, evidencing outcomes for inspection, and showing improvement over time. It is bespoke training without the bespoke price tag, because you build it once and run it whenever you need it.',
      },
    ],
  },
]

export const INDUSTRY_FEED: FeedItem[] = [
  { title: 'National Resilience Standards updated for local responders', source: 'UK Resilience', date: '2026-06-26', url: '#' },
  { title: 'JESIP refreshes joint doctrine for multi-agency commanders', source: 'JESIP', date: '2026-06-20', url: '#' },
  { title: 'NFCC publishes new guidance on incident command competence', source: 'NFCC', date: '2026-06-15', url: '#' },
  { title: 'College of Policing reviews the National Decision Model', source: 'College of Policing', date: '2026-06-09', url: '#' },
  { title: 'Lessons identified: major incident interoperability exercise', source: 'LRF Network', date: '2026-06-03', url: '#' },
]

export function getAllPosts(): NewsPost[] {
  return [...NEWS_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((p) => p.slug === slug)
}

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
