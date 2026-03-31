import { NextRequest, NextResponse } from 'next/server'

export interface StudioTemplateRecord {
  id: string
  title: string
  description: string
  content: unknown // StudioContent JSON
  category: string
  createdAt: string
}

// GET - list templates (localStorage-backed on client, so this returns built-in defaults)
export async function GET() {
  // In the future this would query supabase: studio_templates table
  // For now, return an empty array — templates are stored client-side in localStorage
  const builtInTemplates: StudioTemplateRecord[] = [
    {
      id: 'blank-16-9',
      title: 'Blank 16:9',
      description: 'Empty 1920x1080 canvas',
      content: {
        canvas: { width: 1920, height: 1080, backgroundColor: '#1a1a1a' },
        layers: [],
        tracks: [],
        totalDuration: 10000,
      },
      category: 'basics',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lower-third',
      title: 'Lower Third',
      description: 'Animated lower third text overlay',
      content: {
        canvas: { width: 1920, height: 1080, backgroundColor: '#000000' },
        layers: [
          {
            id: 'lt-bg',
            name: 'Lower Third BG',
            type: 'shape',
            x: 0,
            y: 78,
            width: 40,
            height: 10,
            rotation: 0,
            opacity: 0.85,
            blendMode: 'normal',
            visible: true,
            locked: false,
            color: '#ef4444',
          },
          {
            id: 'lt-text',
            name: 'Name',
            type: 'text',
            x: 2,
            y: 80,
            width: 36,
            height: 6,
            rotation: 0,
            opacity: 1,
            blendMode: 'normal',
            visible: true,
            locked: false,
            text: 'Speaker Name',
            fontSize: 32,
            color: '#ffffff',
          },
        ],
        tracks: [],
        totalDuration: 10000,
      },
      category: 'overlays',
      createdAt: new Date().toISOString(),
    },
  ]

  return NextResponse.json({ templates: builtInTemplates })
}

// POST - save a new template (in the future, persists to Supabase)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content, category } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const template: StudioTemplateRecord = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      content,
      category: category || 'custom',
      createdAt: new Date().toISOString(),
    }

    // Future: insert into supabase studio_templates table
    // For now, just return the template — client stores in localStorage
    return NextResponse.json({ template })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
