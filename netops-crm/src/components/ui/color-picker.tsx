'use client'

import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorPicker({
  label,
  value,
  onChange,
  className,
}: ColorPickerProps) {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 rounded border cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-24 uppercase"
          maxLength={7}
        />
      </div>
    </div>
  )
}

interface ColorPreviewProps {
  colors: string[]
  label?: string
  className?: string
}

export function ColorPreview({
  colors,
  label,
  className,
}: ColorPreviewProps) {
  return (
    <div className={`mt-4 p-4 rounded-lg border bg-muted/30 ${className || ''}`}>
      {label && (
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
      )}
      <div className="flex items-center gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="h-10 w-10 rounded-lg"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}
