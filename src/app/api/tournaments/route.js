import { NextResponse } from 'next/server'
import { getTournaments } from './tournaments'

export async function GET() {
  try {
    const tournaments = getTournaments()
    return NextResponse.json(tournaments)
  } catch (error) {
    console.error('Erro ao carregar torneios:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar torneios' },
      { status: 500 }
    )
  }
}
