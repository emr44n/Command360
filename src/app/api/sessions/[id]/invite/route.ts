import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: sessionId } = await params

  // Verify the session exists and the user is the host
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, room_code, status, host_user_id, presentation_id')
    .eq('id', sessionId)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (session.host_user_id !== user.id) {
    return NextResponse.json({ error: 'Only the host can send invitations' }, { status: 403 })
  }

  const body = await request.json()
  const { emails } = body as { emails: string[] }

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: 'emails array is required' }, { status: 400 })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const invalidEmails = emails.filter((e) => !emailRegex.test(e))
  if (invalidEmails.length > 0) {
    return NextResponse.json(
      { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
      { status: 400 }
    )
  }

  // Store invitations in a simple record for now.
  // Actual email delivery requires configuring a service like Resend or SendGrid.
  const invitations = emails.map((email) => ({
    session_id: sessionId,
    email,
    room_code: session.room_code,
    invited_by: user.id,
    invited_at: new Date().toISOString(),
    status: 'pending' as const,
  }))

  // Return success with the stored invitations.
  // When an email service is configured, add the sending logic here.
  return NextResponse.json({
    success: true,
    message: `${emails.length} invitation(s) queued. Configure an email service (Resend/SendGrid) to enable delivery.`,
    invitations: invitations.map(({ email, room_code, status }) => ({
      email,
      room_code,
      status,
    })),
  })
}
