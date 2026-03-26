import { NextResponse } from 'next/server'

// GET /api/empresas
export async function GET() {
  // Por ahora retorna empty array - cuando haya Supabase, conectar aquí
  return NextResponse.json([])
}

// POST /api/empresas
export async function POST(request: Request) {
  const body = await request.json()
  
  // Validar y procesar
  return NextResponse.json({ success: true, data: body })
}