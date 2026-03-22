"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {}

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    try {
      await login(formData.username, formData.password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/5 to-transparent rounded-full" />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/25 mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Apex Connectivity</h1>
          <p className="text-slate-400 mt-1 font-medium">Soluciones de conectividad empresarial</p>
        </div>

        <Card className="border-slate-800/50 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">Bienvenido</CardTitle>
            <CardDescription className="text-slate-400">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Usuario
                </label>
                <Input
                  type="text"
                  placeholder="nombre.usuario"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value })
                    if (errors.username) {
                      setErrors({ ...errors, username: undefined })
                    }
                  }}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                  disabled={isLoading}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) {
                        setErrors({ ...errors, password: undefined })
                      }
                    }}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/recuperar-password"
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-500 mb-2 font-medium">CREDENCIALES DE DEMO</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="text-slate-500">Admin:</span> admin / admin123</p>
              <p><span className="text-slate-500">Comercial:</span> comercial / demo123</p>
              <p><span className="text-slate-500">Especialista:</span> especialista / demo123</p>
              <p><span className="text-slate-500">Cliente:</span> cliente / demo123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
