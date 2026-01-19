'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')

        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
          router.push('/lobby')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Erro no callback:', error)
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin mb-4 text-4xl">⏳</div>
        <p className="text-white text-lg">Processando autenticação...</p>
      </div>
    </div>
  )
}
