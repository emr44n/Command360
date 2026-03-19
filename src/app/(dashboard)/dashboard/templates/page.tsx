import { TemplateGallery } from '@/components/presentations/TemplateGallery'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Templates — Command 360' }

export default function TemplatesPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ready-made interactive sessions for emergency services. Choose a template and customise it for your team.
        </p>
      </div>
      <TemplateGallery />
    </div>
  )
}
