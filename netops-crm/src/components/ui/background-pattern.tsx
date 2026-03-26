'use client'

import { cn } from '@/lib/utils'

interface BackgroundPatternProps {
  variant?: 'grid' | 'dots' | 'noise' | 'grid-noise'
  className?: string
  opacity?: number
}

export function BackgroundPattern({ 
  variant = 'grid-noise',
  className,
  opacity = 0.03
}: BackgroundPatternProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Grid Pattern */}
      {(variant === 'grid' || variant === 'grid-noise') && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--muted-foreground) / ${opacity}) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--muted-foreground) / ${opacity}) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      )}
      
      {/* Dots Pattern */}
      {variant === 'dots' && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--muted-foreground) / ${opacity * 2}) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      )}
      
      {/* Noise Texture */}
      {(variant === 'noise' || variant === 'grid-noise') && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            filter: 'contrast(120%)'
          }}
        />
      )}
    </div>
  )
}

// Componente para usar en páginas
interface PageBackgroundProps {
  children: React.ReactNode
  variant?: 'grid' | 'dots' | 'noise' | 'grid-noise'
  className?: string
}

export function PageBackground({ 
  children, 
  variant = 'grid-noise',
  className 
}: PageBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      <BackgroundPattern variant={variant} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}