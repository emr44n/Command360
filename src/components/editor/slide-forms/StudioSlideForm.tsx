'use client'
import { useState } from 'react'
import type { Slide, StudioContent, StudioLayer, StudioEvent, StudioEventCategory } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Plus, Trash2, Layers, Zap, Settings2, Palette,
  ChevronDown, ChevronRight, Image, Video, Type, Square,
  Eye, EyeOff, Lock, Unlock, GripVertical,
} from 'lucide-react'

interface Props {
  slide: Slide
  onChange: (content: Slide['content']) => void
}

const DEFAULT_CONTENT: StudioContent = {
  canvas: { width: 1920, height: 1080, backgroundColor: '#1a1a2e' },
  layers: [],
  eventCategories: [],
  events: [],
  votingEnabled: false,
}

export function StudioSlideForm({ slide, onChange }: Props) {
  const content = (slide.content as StudioContent) || DEFAULT_CONTENT
  const [activeTab, setActiveTab] = useState<'scene' | 'layers' | 'events' | 'properties'>('scene')
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  function updateContent(updates: Partial<StudioContent>) {
    onChange({ ...content, ...updates })
  }

  const selectedLayer = content.layers.find((l) => l.id === selectedLayerId) || null

  const tabs = [
    { id: 'scene' as const, label: 'Scene', icon: Palette },
    { id: 'layers' as const, label: 'Layers', icon: Layers },
    { id: 'events' as const, label: 'Events', icon: Zap },
    { id: 'properties' as const, label: 'Properties', icon: Settings2 },
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'scene' && (
        <ScenePanel canvas={content.canvas} onChange={(canvas) => updateContent({ canvas })} />
      )}
      {activeTab === 'layers' && (
        <LayersPanel
          layers={content.layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => {
            setSelectedLayerId(id)
            if (id) setActiveTab('properties')
          }}
          onChange={(layers) => updateContent({ layers })}
        />
      )}
      {activeTab === 'events' && (
        <EventsPanel
          events={content.events}
          categories={content.eventCategories}
          layers={content.layers}
          votingEnabled={content.votingEnabled}
          onChange={(updates) => updateContent(updates)}
        />
      )}
      {activeTab === 'properties' && (
        <PropertiesPanel
          layer={selectedLayer}
          onUpdate={(updated) => {
            updateContent({
              layers: content.layers.map((l) => (l.id === updated.id ? updated : l)),
            })
          }}
        />
      )}
    </div>
  )
}

/* ─── Scene Panel ─── */
function ScenePanel({
  canvas,
  onChange,
}: {
  canvas: StudioContent['canvas']
  onChange: (c: StudioContent['canvas']) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Background colour</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={canvas.backgroundColor}
            onChange={(e) => onChange({ ...canvas, backgroundColor: e.target.value })}
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <Input
            value={canvas.backgroundColor}
            onChange={(e) => onChange({ ...canvas, backgroundColor: e.target.value })}
            placeholder="#1a1a2e"
            className="bg-background border-border text-foreground text-sm font-mono flex-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Width</Label>
          <Input
            type="number"
            value={canvas.width}
            onChange={(e) => onChange({ ...canvas, width: parseInt(e.target.value) || 1920 })}
            className="bg-background border-border text-foreground text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Height</Label>
          <Input
            type="number"
            value={canvas.height}
            onChange={(e) => onChange({ ...canvas, height: parseInt(e.target.value) || 1080 })}
            className="bg-background border-border text-foreground text-sm"
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Layers Panel ─── */
function LayersPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onChange,
}: {
  layers: StudioLayer[]
  selectedLayerId: string | null
  onSelectLayer: (id: string | null) => void
  onChange: (layers: StudioLayer[]) => void
}) {
  function addLayer(type: StudioLayer['type']) {
    const newLayer: StudioLayer = {
      id: crypto.randomUUID(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length + 1}`,
      type,
      x: 10,
      y: 10,
      width: 30,
      height: 30,
      rotation: 0,
      zIndex: layers.length,
      opacity: 1,
      blendMode: 'normal',
      visible: true,
      locked: false,
      ...(type === 'text' ? { text: 'Text', fontSize: 24, fontWeight: '400', color: '#ffffff' } : {}),
      ...(type === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
    }
    onChange([...layers, newLayer])
    onSelectLayer(newLayer.id)
  }

  function removeLayer(id: string) {
    onChange(layers.filter((l) => l.id !== id))
    if (selectedLayerId === id) onSelectLayer(null)
  }

  function toggleVisibility(id: string) {
    onChange(layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))
  }

  function toggleLock(id: string) {
    onChange(layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)))
  }

  const layerTypeIcons: Record<string, React.ElementType> = {
    image: Image,
    video: Video,
    text: Type,
    shape: Square,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide flex-1">Layers</Label>
        <div className="flex gap-1">
          {(['image', 'text', 'shape', 'video'] as const).map((type) => {
            const Icon = layerTypeIcons[type]
            return (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                onClick={() => addLayer(type)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                title={`Add ${type} layer`}
              >
                <Icon className="w-3.5 h-3.5" />
              </Button>
            )
          })}
        </div>
      </div>

      {layers.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-xs">
          No layers yet. Add one above.
        </div>
      )}

      <div className="space-y-1">
        {[...layers].reverse().map((layer) => {
          const Icon = layerTypeIcons[layer.type] || Square
          const isSelected = layer.id === selectedLayerId
          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                isSelected ? 'bg-primary/10 text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <GripVertical className="w-3 h-3 opacity-30" />
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-medium flex-1 truncate">{layer.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleLock(layer.id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); removeLayer(layer.id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Events Panel ─── */
function EventsPanel({
  events,
  categories,
  layers,
  votingEnabled,
  onChange,
}: {
  events: StudioEvent[]
  categories: StudioEventCategory[]
  layers: StudioLayer[]
  votingEnabled: boolean
  onChange: (updates: Partial<StudioContent>) => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function addEvent() {
    const newEvent: StudioEvent = {
      id: crypto.randomUUID(),
      name: `Event ${events.length + 1}`,
      trigger: 'manual',
      actions: [],
    }
    onChange({ events: [...events, newEvent] })
    setExpandedId(newEvent.id)
  }

  function updateEvent(id: string, updates: Partial<StudioEvent>) {
    onChange({ events: events.map((e) => (e.id === id ? { ...e, ...updates } : e)) })
  }

  function removeEvent(id: string) {
    onChange({ events: events.filter((e) => e.id !== id) })
  }

  function addAction(eventId: string) {
    const evt = events.find((e) => e.id === eventId)
    if (!evt) return
    const firstLayer = layers[0]
    updateEvent(eventId, {
      actions: [
        ...evt.actions,
        {
          id: crypto.randomUUID(),
          layerId: firstLayer?.id || '',
          property: 'opacity',
          toValue: 1,
          delay: 0,
          duration: 500,
          easing: 'ease-in-out',
          endBehaviour: 'stay',
        },
      ],
    })
  }

  function removeAction(eventId: string, actionId: string) {
    const evt = events.find((e) => e.id === eventId)
    if (!evt) return
    updateEvent(eventId, { actions: evt.actions.filter((a) => a.id !== actionId) })
  }

  function addVoteOption(eventId: string) {
    const evt = events.find((e) => e.id === eventId)
    if (!evt) return
    updateEvent(eventId, {
      voteOptions: [
        ...(evt.voteOptions || []),
        { id: crypto.randomUUID(), label: '' },
      ],
    })
  }

  function addCategory() {
    const cat: StudioEventCategory = { id: crypto.randomUUID(), name: `Category ${categories.length + 1}` }
    onChange({ eventCategories: [...categories, cat] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Voting</Label>
        <Switch
          checked={votingEnabled}
          onCheckedChange={(v) => onChange({ votingEnabled: v })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Categories</Label>
          <Button variant="ghost" size="sm" onClick={addCategory} className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground px-1.5">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <input
              type="color"
              value={cat.color || '#6b7280'}
              onChange={(e) =>
                onChange({ eventCategories: categories.map((c) => (c.id === cat.id ? { ...c, color: e.target.value } : c)) })
              }
              className="w-6 h-6 rounded border border-border cursor-pointer"
            />
            <Input
              value={cat.name}
              onChange={(e) =>
                onChange({ eventCategories: categories.map((c) => (c.id === cat.id ? { ...c, name: e.target.value } : c)) })
              }
              className="bg-background border-border text-foreground text-xs flex-1 h-7"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ eventCategories: categories.filter((c) => c.id !== cat.id) })}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Events</Label>
          <Button variant="ghost" size="sm" onClick={addEvent} className="h-6 gap-1 text-xs text-muted-foreground hover:text-foreground px-1.5">
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>

        {events.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-xs">
            No events. Events trigger layer changes.
          </div>
        )}

        {events.map((evt) => {
          const isExpanded = expandedId === evt.id
          return (
            <div key={evt.id} className="border border-border rounded-lg overflow-hidden">
              <div
                onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                <Zap className="w-3 h-3" style={{ color: evt.color || '#ef4444' }} />
                <span className="text-xs font-medium flex-1 truncate">{evt.name}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {evt.trigger}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); removeEvent(evt.id) }}
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                  <div className="space-y-2">
                    <Input
                      value={evt.name}
                      onChange={(e) => updateEvent(evt.id, { name: e.target.value })}
                      placeholder="Event name"
                      className="bg-background border-border text-foreground text-xs h-7"
                    />
                    <div className="flex gap-2">
                      <select
                        value={evt.trigger}
                        onChange={(e) => updateEvent(evt.id, { trigger: e.target.value as 'manual' | 'vote' })}
                        className="flex-1 bg-background border border-border text-foreground text-xs rounded-md h-7 px-2"
                      >
                        <option value="manual">Manual</option>
                        <option value="vote">Vote</option>
                      </select>
                      {categories.length > 0 && (
                        <select
                          value={evt.categoryId || ''}
                          onChange={(e) => updateEvent(evt.id, { categoryId: e.target.value || undefined })}
                          className="flex-1 bg-background border border-border text-foreground text-xs rounded-md h-7 px-2"
                        >
                          <option value="">No category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={evt.color || '#ef4444'}
                        onChange={(e) => updateEvent(evt.id, { color: e.target.value })}
                        className="w-7 h-7 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={evt.icon || ''}
                        onChange={(e) => updateEvent(evt.id, { icon: e.target.value })}
                        placeholder="Icon emoji"
                        className="bg-background border-border text-foreground text-xs h-7 w-20"
                      />
                    </div>
                  </div>

                  {/* Vote options (only for vote trigger) */}
                  {evt.trigger === 'vote' && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-[10px] uppercase tracking-wide">Vote question</Label>
                      <Input
                        value={evt.voteQuestion || ''}
                        onChange={(e) => updateEvent(evt.id, { voteQuestion: e.target.value })}
                        placeholder="What should happen?"
                        className="bg-background border-border text-foreground text-xs h-7"
                      />
                      <Label className="text-muted-foreground text-[10px] uppercase tracking-wide">Options</Label>
                      {(evt.voteOptions || []).map((opt, oi) => (
                        <div key={opt.id} className="flex gap-1.5">
                          <Input
                            value={opt.label}
                            onChange={(e) => {
                              const newOpts = (evt.voteOptions || []).map((o) =>
                                o.id === opt.id ? { ...o, label: e.target.value } : o
                              )
                              updateEvent(evt.id, { voteOptions: newOpts })
                            }}
                            placeholder={`Option ${oi + 1}`}
                            className="bg-background border-border text-foreground text-xs h-7 flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              updateEvent(evt.id, {
                                voteOptions: (evt.voteOptions || []).filter((o) => o.id !== opt.id),
                              })
                            }}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addVoteOption(evt.id)} className="gap-1 text-xs text-muted-foreground px-0 h-6">
                        <Plus className="w-3 h-3" /> Add option
                      </Button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] uppercase tracking-wide">Actions ({evt.actions.length})</Label>
                    {evt.actions.map((action) => {
                      const targetLayer = layers.find((l) => l.id === action.layerId)
                      return (
                        <div key={action.id} className="flex items-center gap-1.5 bg-muted/50 rounded px-2 py-1">
                          <span className="text-[10px] text-muted-foreground truncate flex-1">
                            {targetLayer?.name || 'Unknown'} &rarr; {action.property} = {String(action.toValue)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{action.duration}ms</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAction(evt.id, action.id)}
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addAction(evt.id)}
                      disabled={layers.length === 0}
                      className="gap-1 text-xs text-muted-foreground px-0 h-6"
                    >
                      <Plus className="w-3 h-3" /> Add action
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Properties Panel ─── */
function PropertiesPanel({
  layer,
  onUpdate,
}: {
  layer: StudioLayer | null
  onUpdate: (layer: StudioLayer) => void
}) {
  if (!layer) {
    return (
      <div className="text-center py-8 text-muted-foreground text-xs">
        Select a layer to edit its properties.
      </div>
    )
  }

  function update(updates: Partial<StudioLayer>) {
    onUpdate({ ...layer!, ...updates })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Name</Label>
        <Input
          value={layer.name}
          onChange={(e) => update({ name: e.target.value })}
          className="bg-background border-border text-foreground text-sm"
        />
      </div>

      {/* Position & Size */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Position & Size (%)</Label>
        <div className="grid grid-cols-2 gap-2">
          {(['x', 'y', 'width', 'height'] as const).map((prop) => (
            <div key={prop} className="space-y-1">
              <Label className="text-muted-foreground text-[10px] uppercase">{prop}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={layer[prop]}
                onChange={(e) => update({ [prop]: parseFloat(e.target.value) || 0 })}
                className="bg-background border-border text-foreground text-xs h-7"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation & Opacity */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-[10px] uppercase">Rotation</Label>
          <Input
            type="number"
            value={layer.rotation}
            onChange={(e) => update({ rotation: parseFloat(e.target.value) || 0 })}
            className="bg-background border-border text-foreground text-xs h-7"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-[10px] uppercase">Opacity</Label>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={layer.opacity}
            onChange={(e) => update({ opacity: parseFloat(e.target.value) || 0 })}
            className="bg-background border-border text-foreground text-xs h-7"
          />
        </div>
      </div>

      {/* z-index */}
      <div className="space-y-1">
        <Label className="text-muted-foreground text-[10px] uppercase">Z-Index</Label>
        <Input
          type="number"
          value={layer.zIndex}
          onChange={(e) => update({ zIndex: parseInt(e.target.value) || 0 })}
          className="bg-background border-border text-foreground text-xs h-7"
        />
      </div>

      {/* Blend mode */}
      <div className="space-y-1">
        <Label className="text-muted-foreground text-[10px] uppercase">Blend Mode</Label>
        <select
          value={layer.blendMode}
          onChange={(e) => update({ blendMode: e.target.value as StudioLayer['blendMode'] })}
          className="w-full bg-background border border-border text-foreground text-xs rounded-md h-7 px-2"
        >
          {['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Source (image/video) */}
      {(layer.type === 'image' || layer.type === 'video') && (
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Source URL</Label>
          <Input
            value={layer.src || ''}
            onChange={(e) => update({ src: e.target.value })}
            placeholder="https://..."
            className="bg-background border-border text-foreground text-xs"
          />
        </div>
      )}

      {/* Text properties */}
      {layer.type === 'text' && (
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Text</Label>
          <Input
            value={layer.text || ''}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Enter text..."
            className="bg-background border-border text-foreground text-sm"
          />
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-[10px] uppercase">Size</Label>
              <Input
                type="number"
                value={layer.fontSize || 24}
                onChange={(e) => update({ fontSize: parseInt(e.target.value) || 24 })}
                className="bg-background border-border text-foreground text-xs h-7"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-[10px] uppercase">Weight</Label>
              <select
                value={layer.fontWeight || '400'}
                onChange={(e) => update({ fontWeight: e.target.value })}
                className="w-full bg-background border border-border text-foreground text-xs rounded-md h-7 px-1"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="600">Semi</option>
                <option value="700">Bold</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-[10px] uppercase">Colour</Label>
              <input
                type="color"
                value={layer.color || '#ffffff'}
                onChange={(e) => update({ color: e.target.value })}
                className="w-full h-7 rounded border border-border cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video props */}
      {layer.type === 'video' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Loop</Label>
            <Switch checked={layer.loop ?? true} onCheckedChange={(v) => update({ loop: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Autoplay</Label>
            <Switch checked={layer.autoplay ?? true} onCheckedChange={(v) => update({ autoplay: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Muted</Label>
            <Switch checked={layer.muted ?? true} onCheckedChange={(v) => update({ muted: v })} />
          </div>
        </div>
      )}
    </div>
  )
}
