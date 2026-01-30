'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

interface Tournament {
  id: number
  time: string
  date: string
  site: string
  name: string
  type: string
  buyin: number
  guaranteed: number
  field: number
  priority: string
  status: string
}

export default function Home() {
  redirect('/auth/login')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTournaments() {
      try {
        const response = await fetch('/api/tournaments')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        setTournaments(data.tournaments || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [])

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Erro: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pega Blinder Lobby</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Torneios ({tournaments.length})</h2>
        
        {tournaments.map(t => (
          <div key={t.id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <h3>{t.name}</h3>
            <p><strong>Site:</strong> {t.site}</p>
            <p><strong>Horário:</strong> {t.time}</p>
            <p><strong>Buy-in:</strong> ${t.buyin}</p>
            <p><strong>Garantido:</strong> ${t.guaranteed}</p>
            <p><strong>Status:</strong> {t.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
