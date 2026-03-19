import { NextRequest, NextResponse } from 'next/server'

const MIGRATION_SQL = `
-- Enable rating_scale and open_text slide types + speaker notes
ALTER TABLE slides DROP CONSTRAINT IF EXISTS slides_slide_type_check;
ALTER TABLE slides ADD CONSTRAINT slides_slide_type_check
  CHECK (slide_type IN ('poll', 'word_cloud', 'quiz', 'qna', 'survey', 'content', 'rating_scale', 'open_text'));
ALTER TABLE slides ADD COLUMN IF NOT EXISTS speaker_notes TEXT DEFAULT '';
`

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      error: 'Missing environment variables',
    }, { status: 400 })
  }

  // Accept database_url from body or env
  let database_url: string | undefined
  try {
    const body = await req.json()
    database_url = body.database_url
  } catch {
    // empty body is fine
  }
  database_url = database_url || process.env.DATABASE_URL

  // Try pg if DATABASE_URL is available
  if (database_url) {
    try {
      const { Client } = require('pg')
      const client = new Client({
        connectionString: database_url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
      })
      await client.connect()
      await client.query(MIGRATION_SQL)
      await client.end()
      return NextResponse.json({ success: true, message: 'Migration complete — rating_scale and open_text slide types enabled, speaker_notes column added.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return NextResponse.json({ error: `pg connection failed: ${message}`, sql: MIGRATION_SQL.trim() }, { status: 500 })
    }
  }

  // No DATABASE_URL — provide instructions
  const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'
  return NextResponse.json({
    error: 'Auto-migration requires DATABASE_URL. Run this SQL in Supabase Dashboard:',
    sql: MIGRATION_SQL.trim(),
    dashboard_url: `https://supabase.com/dashboard/project/${projectRef}/sql/new`,
    instructions: [
      `1. Go to https://supabase.com/dashboard/project/${projectRef}/sql/new`,
      '2. Paste the SQL below and click "Run"',
      '3. Come back and retry adding Rating Scale or Open Text slides',
    ],
  }, { status: 400 })
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'

  return NextResponse.json({
    info: 'POST to this endpoint to run database migration, or run the SQL below manually in Supabase Dashboard.',
    sql: MIGRATION_SQL.trim(),
    dashboard_url: `https://supabase.com/dashboard/project/${projectRef}/sql/new`,
    instructions: [
      `1. Open: https://supabase.com/dashboard/project/${projectRef}/sql/new`,
      '2. Paste the SQL above into the editor',
      '3. Click "Run" to execute',
      '4. Rating Scale and Open Text slide types will now work',
    ],
  })
}
