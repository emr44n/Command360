'use client'

import React, { useState } from 'react'
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Trash2Icon,
  GripVerticalIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type {
  StudioEvent,
  StudioEventCategory,
  StudioLayer,
  StudioAction,
  StudioVoteOption,
} from '@/types/slide'
import { generateEventId, generateLayerId } from '@/lib/utils/studio-utils'

interface StudioEventsProps {
  events: StudioEvent[]
  eventCategories: StudioEventCategory[]
  layers: StudioLayer[]
  onUpdateEvents: (events: StudioEvent[]) => void
  onUpdateCategories: (categories: StudioEventCategory[]) => void
}

const EASING_OPTIONS: StudioAction['easing'][] = [
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
]

const END_BEHAVIOUR_OPTIONS: StudioAction['endBehaviour'][] = [
  'stay',
  'fadeOut',
  'reset',
]

const ACTION_PROPERTIES: StudioAction['property'][] = [
  'opacity',
  'visible',
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'src',
]

function newAction(layerId: string): StudioAction {
  return {
    id: generateLayerId(),
    layerId,
    property: 'opacity',
    toValue: 1,
    delay: 0,
    duration: 500,
    easing: 'ease-in-out',
    endBehaviour: 'stay',
  }
}

function newVoteOption(): StudioVoteOption {
  return {
    id: generateLayerId(),
    label: 'Option',
  }
}

export function StudioEvents({
  events,
  eventCategories,
  layers,
  onUpdateEvents,
  onUpdateCategories,
}: StudioEventsProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['__uncategorised'])
  )

  const toggleEvent = (id: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /* ---- Category CRUD ---- */
  const addCategory = () => {
    const cat: StudioEventCategory = {
      id: generateLayerId(),
      name: 'New Category',
    }
    onUpdateCategories([...eventCategories, cat])
    setExpandedCategories((prev) => new Set(prev).add(cat.id))
  }

  const updateCategory = (
    id: string,
    updates: Partial<StudioEventCategory>
  ) => {
    onUpdateCategories(
      eventCategories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const deleteCategory = (id: string) => {
    onUpdateCategories(eventCategories.filter((c) => c.id !== id))
    // Move events in that category to uncategorised
    onUpdateEvents(
      events.map((e) =>
        e.categoryId === id ? { ...e, categoryId: undefined } : e
      )
    )
  }

  /* ---- Event CRUD ---- */
  const addEvent = (categoryId?: string) => {
    const evt: StudioEvent = {
      id: generateEventId(),
      name: 'New Event',
      categoryId,
      trigger: 'manual',
      actions: [],
    }
    onUpdateEvents([...events, evt])
    setExpandedEvents((prev) => new Set(prev).add(evt.id))
  }

  const updateEvent = (id: string, updates: Partial<StudioEvent>) => {
    onUpdateEvents(
      events.map((e) => (e.id === id ? { ...e, ...updates } : e))
    )
  }

  const deleteEvent = (id: string) => {
    onUpdateEvents(events.filter((e) => e.id !== id))
  }

  /* ---- Action CRUD ---- */
  const addAction = (eventId: string) => {
    const firstLayerId = layers[0]?.id ?? ''
    const action = newAction(firstLayerId)
    onUpdateEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, actions: [...e.actions, action] } : e
      )
    )
  }

  const updateAction = (
    eventId: string,
    actionId: string,
    updates: Partial<StudioAction>
  ) => {
    onUpdateEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              actions: e.actions.map((a) =>
                a.id === actionId ? { ...a, ...updates } : a
              ),
            }
          : e
      )
    )
  }

  const deleteAction = (eventId: string, actionId: string) => {
    onUpdateEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, actions: e.actions.filter((a) => a.id !== actionId) }
          : e
      )
    )
  }

  /* ---- Vote options ---- */
  const addVoteOption = (eventId: string) => {
    const option = newVoteOption()
    onUpdateEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, voteOptions: [...(e.voteOptions ?? []), option] }
          : e
      )
    )
  }

  const updateVoteOption = (
    eventId: string,
    optionId: string,
    updates: Partial<StudioVoteOption>
  ) => {
    onUpdateEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              voteOptions: (e.voteOptions ?? []).map((o) =>
                o.id === optionId ? { ...o, ...updates } : o
              ),
            }
          : e
      )
    )
  }

  const deleteVoteOption = (eventId: string, optionId: string) => {
    onUpdateEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              voteOptions: (e.voteOptions ?? []).filter(
                (o) => o.id !== optionId
              ),
            }
          : e
      )
    )
  }

  /* ---- Render helpers ---- */

  const renderAction = (eventId: string, action: StudioAction) => (
    <div
      key={action.id}
      className="rounded border border-zinc-700 bg-zinc-800/60 p-2 space-y-2"
    >
      <div className="flex items-center gap-2">
        <GripVerticalIcon className="size-3 text-zinc-500" />
        <span className="flex-1 text-[10px] uppercase tracking-wider text-zinc-400">
          Action
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-red-400 hover:text-red-300"
          onClick={() => deleteAction(eventId, action.id)}
        >
          <Trash2Icon className="size-3" />
        </Button>
      </div>

      {/* Layer target */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-zinc-400">Layer</Label>
          <Select
            value={action.layerId}
            onValueChange={(v) =>
              updateAction(eventId, action.id, { layerId: v })
            }
          >
            <SelectTrigger className="h-6 w-full border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layers.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-zinc-400">Property</Label>
          <Select
            value={action.property}
            onValueChange={(v) =>
              updateAction(eventId, action.id, {
                property: v as StudioAction['property'],
              })
            }
          >
            <SelectTrigger className="h-6 w-full border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_PROPERTIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Value */}
      <div>
        <Label className="text-[10px] text-zinc-400">To Value</Label>
        <Input
          value={String(action.toValue)}
          onChange={(e) => {
            const raw = e.target.value
            let parsed: string | number | boolean = raw
            if (raw === 'true') parsed = true
            else if (raw === 'false') parsed = false
            else if (!isNaN(Number(raw)) && raw !== '') parsed = Number(raw)
            updateAction(eventId, action.id, { toValue: parsed })
          }}
          className="h-6 border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100"
        />
      </div>

      {/* Timing */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-zinc-400">Delay (ms)</Label>
          <Input
            type="number"
            value={action.delay}
            min={0}
            onChange={(e) =>
              updateAction(eventId, action.id, {
                delay: parseInt(e.target.value) || 0,
              })
            }
            className="h-6 border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100"
          />
        </div>
        <div>
          <Label className="text-[10px] text-zinc-400">Duration (ms)</Label>
          <Input
            type="number"
            value={action.duration}
            min={0}
            onChange={(e) =>
              updateAction(eventId, action.id, {
                duration: parseInt(e.target.value) || 0,
              })
            }
            className="h-6 border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100"
          />
        </div>
      </div>

      {/* Easing & End Behaviour */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-zinc-400">Easing</Label>
          <Select
            value={action.easing}
            onValueChange={(v) =>
              updateAction(eventId, action.id, {
                easing: v as StudioAction['easing'],
              })
            }
          >
            <SelectTrigger className="h-6 w-full border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EASING_OPTIONS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-zinc-400">End Behaviour</Label>
          <Select
            value={action.endBehaviour}
            onValueChange={(v) =>
              updateAction(eventId, action.id, {
                endBehaviour: v as StudioAction['endBehaviour'],
              })
            }
          >
            <SelectTrigger className="h-6 w-full border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {END_BEHAVIOUR_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderEvent = (event: StudioEvent) => {
    const isExpanded = expandedEvents.has(event.id)

    return (
      <div key={event.id} className="border-b border-zinc-800/50">
        {/* Event header */}
        <button
          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-zinc-800/40"
          onClick={() => toggleEvent(event.id)}
        >
          {isExpanded ? (
            <ChevronDownIcon className="size-3 text-zinc-400" />
          ) : (
            <ChevronRightIcon className="size-3 text-zinc-400" />
          )}
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: event.color ?? '#6366f1' }}
          />
          <span className="flex-1 truncate">{event.name}</span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
            {event.trigger}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-zinc-500 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation()
              deleteEvent(event.id)
            }}
          >
            <Trash2Icon className="size-3" />
          </Button>
        </button>

        {/* Event expanded content */}
        {isExpanded && (
          <div className="space-y-2 px-3 pb-3 pt-1">
            {/* Name */}
            <div>
              <Label className="text-[10px] text-zinc-400">Name</Label>
              <Input
                value={event.name}
                onChange={(e) =>
                  updateEvent(event.id, { name: e.target.value })
                }
                className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-[10px] text-zinc-400">Category</Label>
              <Select
                value={event.categoryId ?? '__none'}
                onValueChange={(v) =>
                  updateEvent(event.id, {
                    categoryId: v === '__none' ? undefined : v,
                  })
                }
              >
                <SelectTrigger className="h-7 w-full border-zinc-700 bg-zinc-800 text-xs text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Uncategorised</SelectItem>
                  {eventCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trigger type */}
            <div>
              <Label className="text-[10px] text-zinc-400">Trigger</Label>
              <div className="mt-1 flex gap-2">
                <label className="flex items-center gap-1 text-xs text-zinc-300">
                  <input
                    type="radio"
                    name={`trigger-${event.id}`}
                    checked={event.trigger === 'manual'}
                    onChange={() =>
                      updateEvent(event.id, { trigger: 'manual' })
                    }
                    className="accent-red-500"
                  />
                  Manual
                </label>
                <label className="flex items-center gap-1 text-xs text-zinc-300">
                  <input
                    type="radio"
                    name={`trigger-${event.id}`}
                    checked={event.trigger === 'vote'}
                    onChange={() => updateEvent(event.id, { trigger: 'vote' })}
                    className="accent-red-500"
                  />
                  Vote
                </label>
              </div>
            </div>

            {/* Vote-specific fields */}
            {event.trigger === 'vote' && (
              <div className="space-y-2 rounded border border-zinc-700 bg-zinc-800/40 p-2">
                <div>
                  <Label className="text-[10px] text-zinc-400">
                    Vote Question
                  </Label>
                  <Input
                    value={event.voteQuestion ?? ''}
                    onChange={(e) =>
                      updateEvent(event.id, {
                        voteQuestion: e.target.value,
                      })
                    }
                    placeholder="What should happen next?"
                    className="h-7 border-zinc-700 bg-zinc-900 text-xs text-zinc-100"
                  />
                </div>

                <Label className="text-[10px] text-zinc-400">
                  Vote Options
                </Label>
                {(event.voteOptions ?? []).map((opt) => (
                  <div key={opt.id} className="flex items-center gap-1">
                    <Input
                      value={opt.label}
                      onChange={(e) =>
                        updateVoteOption(event.id, opt.id, {
                          label: e.target.value,
                        })
                      }
                      className="h-6 flex-1 border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-red-400 hover:text-red-300"
                      onClick={() => deleteVoteOption(event.id, opt.id)}
                    >
                      <Trash2Icon className="size-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 w-full border-dashed border-zinc-600 bg-transparent text-[11px] text-zinc-400 hover:bg-zinc-800"
                  onClick={() => addVoteOption(event.id)}
                >
                  <PlusIcon className="mr-1 size-3" /> Add Option
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-zinc-400">
                Actions
              </Label>
              {event.actions.map((action) =>
                renderAction(event.id, action)
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-full border-dashed border-zinc-600 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800"
                onClick={() => addAction(event.id)}
              >
                <PlusIcon className="mr-1 size-3.5" /> Add Action
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  /* ---- Group events by category ---- */
  const uncategorisedEvents = events.filter(
    (e) => !e.categoryId || !eventCategories.some((c) => c.id === e.categoryId)
  )

  return (
    <div className="flex h-full flex-col bg-zinc-900 text-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Events
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] text-zinc-400 hover:text-zinc-100"
            onClick={addCategory}
          >
            <PlusIcon className="mr-0.5 size-3" /> Category
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] text-zinc-400 hover:text-zinc-100"
            onClick={() => addEvent()}
          >
            <PlusIcon className="mr-0.5 size-3" /> Event
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Categorised events */}
        {eventCategories.map((cat) => {
          const catEvents = events.filter((e) => e.categoryId === cat.id)
          const isOpen = expandedCategories.has(cat.id)

          return (
            <Collapsible
              key={cat.id}
              open={isOpen}
              onOpenChange={() => toggleCategory(cat.id)}
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 border-b border-zinc-800 bg-zinc-800/30 px-3 py-1.5 text-left text-xs hover:bg-zinc-800/50">
                {isOpen ? (
                  <ChevronDownIcon className="size-3 text-zinc-400" />
                ) : (
                  <ChevronRightIcon className="size-3 text-zinc-400" />
                )}
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: cat.color ?? '#8b5cf6' }}
                />
                <span className="flex-1 font-medium">{cat.name}</span>
                <span className="text-[10px] text-zinc-500">
                  {catEvents.length}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  className="inline-flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    addEvent(cat.id)
                  }}
                >
                  <PlusIcon className="size-3" />
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  className="inline-flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCategory(cat.id)
                  }}
                >
                  <Trash2Icon className="size-3" />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {catEvents.length === 0 && (
                  <p className="px-3 py-2 text-[11px] text-zinc-500">
                    No events in this category
                  </p>
                )}
                {catEvents.map(renderEvent)}
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        {/* Uncategorised events */}
        {uncategorisedEvents.length > 0 && (
          <Collapsible
            open={expandedCategories.has('__uncategorised')}
            onOpenChange={() => toggleCategory('__uncategorised')}
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2 border-b border-zinc-800 bg-zinc-800/30 px-3 py-1.5 text-left text-xs hover:bg-zinc-800/50">
              {expandedCategories.has('__uncategorised') ? (
                <ChevronDownIcon className="size-3 text-zinc-400" />
              ) : (
                <ChevronRightIcon className="size-3 text-zinc-400" />
              )}
              <span className="flex-1 font-medium text-zinc-400">
                Uncategorised
              </span>
              <span className="text-[10px] text-zinc-500">
                {uncategorisedEvents.length}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {uncategorisedEvents.map(renderEvent)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {events.length === 0 && eventCategories.length === 0 && (
          <p className="p-4 text-center text-xs text-zinc-500">
            No events created yet. Add a category or event to get started.
          </p>
        )}
      </div>
    </div>
  )
}
