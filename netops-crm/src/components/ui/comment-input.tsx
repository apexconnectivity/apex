"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Generic comment type for creation (simpler than ActivityFeed's Comment)
export interface CommentInputData {
  id?: string
  comentario: string
  usuario_nombre?: string
}

interface CommentInputProps {
  comments: CommentInputData[]
  onAdd: (comentario: string) => void
  onRemove?: (index: number) => void
  currentUserName?: string
  placeholder?: string
  title?: string
  maxHeight?: string
  disabled?: boolean
  className?: string
}

/**
 * CommentInput - Componente para agregar comentarios durante creación
 * 
 * A diferencia de ActivityFeed (para visualización), este es para
 * crear nuevos comentarios en formularios de creación/edición.
 */
export function CommentInput({
  comments,
  onAdd,
  onRemove,
  currentUserName = 'Usuario',
  placeholder = 'Nuevo comentario...',
  title = 'Comentarios',
  maxHeight = 'max-h-[150px]',
  disabled = false,
  className,
}: CommentInputProps) {
  const [newComment, setNewComment] = useState('')

  const handleAdd = () => {
    if (newComment.trim()) {
      onAdd(newComment.trim())
      setNewComment('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <h3 className="font-medium text-sm flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        {title}
      </h3>

      {/* Lista de comentarios */}
      {comments.length > 0 && (
        <div className={cn('space-y-2 overflow-y-auto', maxHeight)}>
          {comments.map((comment, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{comment.usuario_nombre || currentUserName}</span>
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onRemove(index)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-sm">{comment.comentario}</p>
            </div>
          ))}
        </div>
      )}

      {/* Input para agregar */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={disabled || !newComment.trim()}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
