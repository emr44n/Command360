'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

interface ExportExcelButtonProps {
  sessionId: string
  sessionTitle?: string
}

export function ExportExcelButton({ sessionId, sessionTitle }: ExportExcelButtonProps) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/analytics`)
      if (!res.ok) throw new Error('Failed to fetch analytics')
      const data = await res.json()

      const wb = XLSX.utils.book_new()

      // Sheet 1: Participants
      const participantsRows = (data.participants || []).map((p: { name?: string; joined_at?: string; id: string }) => ({
        'Participant ID': p.id,
        'Name': p.name || 'Anonymous',
        'Joined At': p.joined_at || '-',
      }))
      const participantsWs = XLSX.utils.json_to_sheet(
        participantsRows.length > 0 ? participantsRows : [{ 'Participant ID': '-', 'Name': '-', 'Joined At': '-' }]
      )
      XLSX.utils.book_append_sheet(wb, participantsWs, 'Participants')

      // Sheet 2: Responses
      const responsesData = Object.entries(data.slideResponseCounts || {}).map(([slideId, count]) => ({
        'Slide ID': slideId,
        'Response Count': count as number,
      }))
      const responsesWs = XLSX.utils.json_to_sheet(
        responsesData.length > 0 ? responsesData : [{ 'Slide ID': '-', 'Response Count': 0 }]
      )
      XLSX.utils.book_append_sheet(wb, responsesWs, 'Responses')

      // Sheet 3: Summary
      const summaryWs = XLSX.utils.json_to_sheet([{
        'Session ID': data.sessionId,
        'Status': data.status,
        'Started At': data.startedAt || '-',
        'Ended At': data.endedAt || '-',
        'Duration (s)': data.durationSeconds ?? '-',
        'Participants': data.participantCount,
        'Total Responses': data.totalResponses,
        'Slide Count': data.slideCount,
        'Interactive Slides': data.interactiveSlideCount,
        'Vote Participation %': data.voteParticipationRate ?? '-',
        'Avg Response Time (ms)': data.avgResponseTimeMs ?? '-',
      }])
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

      const filename = `${(sessionTitle || 'session').replace(/[^a-zA-Z0-9]/g, '_')}_report.xlsx`
      XLSX.writeFile(wb, filename)
      toast.success('Excel report downloaded')
    } catch (err) {
      toast.error('Failed to export Excel report')
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={exporting}
      variant="outline"
      className="gap-2"
    >
      {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {exporting ? 'Exporting...' : 'Export Excel'}
    </Button>
  )
}
