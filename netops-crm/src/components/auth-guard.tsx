"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

const PUBLIC_PATHS = ['/login', '/recuperar-password']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) return

    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login')
    } else if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
  
  if (!isAuthenticated && !isPublicPath) {
    return null
  }

  return <>{children}</>
}
