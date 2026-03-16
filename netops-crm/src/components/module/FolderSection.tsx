import { useState } from 'react'
import { Folder, FolderOpen, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Archivo } from '@/types/archivos'
import { EMPTY_MESSAGES } from '@/constants/archivos'
import ArchivoCard from './ArchivoCard'

interface FolderSectionProps {
  titulo: string
  icon: React.ComponentType<{ className?: string }>
  archivos: Archivo[]
  onVer: (archivo: Archivo) => void
  onEliminar: (archivo: Archivo) => void
  defaultOpen?: boolean
}

export default function FolderSection({
  titulo,
  icon: Icon,
  archivos,
  onVer,
  onEliminar,
  defaultOpen = false,
}: FolderSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-2 p-4 bg-muted/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FolderOpen className="h-5 w-5 text-amber-500" />
        ) : (
          <Folder className="h-5 w-5 text-amber-500" />
        )}
        <span className="font-medium flex-1 text-left">{titulo}</span>
        <Badge variant="secondary" className="mr-2">
          {archivos.length}
        </Badge>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 space-y-2">
          {archivos.length > 0 ? (
            archivos.map((archivo) => (
              <ArchivoCard
                key={archivo.id}
                archivo={archivo}
                onVer={() => onVer(archivo)}
                onEliminar={() => onEliminar(archivo)}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {EMPTY_MESSAGES.noArchivosCarpeta}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
