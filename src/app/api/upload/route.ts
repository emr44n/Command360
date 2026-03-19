import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BUCKET = 'presentation-assets'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

// Admin client for storage operations
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Ensure bucket exists (idempotent)
async function ensureBucket() {
  const admin = getAdminClient()
  const { data } = await admin.storage.getBucket(BUCKET)
  if (!data) {
    await admin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    })
  }
}

export async function POST(req: NextRequest) {
  // Auth check via user's session
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `File type not allowed. Accepted: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 400 }
    )
  }

  await ensureBucket()
  const admin = getAdminClient()

  // Generate unique file path: user_id/timestamp-filename
  const ext = file.name.split('.').pop() || 'png'
  const safeName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100)
  const filePath = `${user.id}/${Date.now()}-${safeName}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await admin.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // Get public URL
  const { data: urlData } = admin.storage
    .from(BUCKET)
    .getPublicUrl(data.path)

  return NextResponse.json({
    url: urlData.publicUrl,
    path: data.path,
  })
}
