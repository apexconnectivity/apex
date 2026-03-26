'use client'

import { useEffect, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageAnimationProps {
  children: ReactNode
  delay?: number // delay base en ms
  stagger?: number // delay entre cada elemento
  className?: string
}

export function PageAnimation({ 
  children, 
  delay = 0, 
  stagger = 50,
  className 
}: PageAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Componente para elementos staggerados
interface StaggeredListProps {
  children: ReactNode | ReactNode[]
  delay?: number
  stagger?: number
  className?: string
}

export function StaggeredList({ 
  children, 
  delay = 100, 
  stagger = 50,
  className 
}: StaggeredListProps) {
  return (
    <div className={className}>
      {Array.isArray(children) ? children.map((child, index) => (
        <PageAnimation 
          key={index} 
          delay={delay + (index * stagger)}
        >
          {child}
        </PageAnimation>
      )) : children}
    </div>
  )
}
