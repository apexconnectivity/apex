"use client"

import { cn } from "@/lib/utils"

interface TextDescriptionCommentsProps {
  text: string
  className?: string
}

/**
 * TextDescriptionComments - Componente para formatear texto con capitalize
 * Convierte la primera letra de cada párrafo en mayúscula
 */
export function TextDescriptionComments({ text, className }: TextDescriptionCommentsProps) {
  if (!text) return null

  // Dividir el texto en párrafos (por saltos de línea)
  const paragraphs = text.split(/\n+/)

  const formattedParagraphs = paragraphs.map((paragraph) => {
    if (!paragraph.trim()) return null
    // Convertir primera letra a mayúscula
    return paragraph.charAt(0).toUpperCase() + paragraph.slice(1)
  })

  return (
    <div className={cn("whitespace-pre-wrap", className)}>
      {formattedParagraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? "mt-2" : ""}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}
