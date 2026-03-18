"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Plus, Clock } from 'lucide-react'

// Generic comment type that can be used across different entity types
export interface Comment {
  id: string
  usuario_nombre: string
  comentario: string
  fecha?: string
  es_interno?: boolean
}

interface ActivityFeedProps {
  comments: Comment[]
  onAddComment: (comment: string, isInternal?: boolean) => void
  placeholder?: string
  submitLabel?: string
  showDate?: boolean
  showInternalToggle?: boolean
  emptyMessage?: string
  title?: string
}

export function ActivityFeed({
  comments,
  onAddComment,
  placeholder = 'Nuevo comentario...',
  submitLabel = 'Agregar',
  showDate = true,
  showInternalToggle = false,
  emptyMessage = 'No hay comentarios todavía',
  title = 'Comentarios',
}: ActivityFeedProps) {
  const [newComment, setNewComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim(), isInternal)
      setNewComment('')
      setIsInternal(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Format date helper
  const formatFecha = (fecha?: string) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {title} ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-muted/30 rounded-lg p-3 ${comment.es_interno ? 'border-l-2 border-amber-500/50' : ''
                }`}
            >
              <div className="flex items-center justify-between text-xs mb-1 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.usuario_nombre}</span>
                  {comment.es_interno && (
                    <span className="text-amber-400 text-[10px] bg-amber-500/15 px-1.5 py-0.5 rounded">
                      INTERNO
                    </span>
                  )}
                </div>
                {showDate && comment.fecha && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatFecha(comment.fecha)}
                  </span>
                )}
              </div>
              <p className="text-sm">{comment.comentario}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="space-y-2 pt-2">
        <Input
          placeholder={placeholder}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between">
          {showInternalToggle && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-input"
              />
              Comentario interno
            </label>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {showInternalToggle && <div className="flex-1" />}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
