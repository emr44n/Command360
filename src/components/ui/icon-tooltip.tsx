"use client"

import * as React from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface IconTooltipProps {
  label: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
}

export function IconTooltip({ label, children, side = "top" }: IconTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}
