'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'

export default function LobbyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [iframeContent, setIframeContent] = useState<string>('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    // ✅ Só carregar iframe quando user estiver disponível
    if (user) {
      fetch('/lobby/index.html')
        .then(res => res.text())
        .then(html => {
          const modifiedHtml = html
            .replace(/<body/g, '<body style="margin: 0; padding: 0;"')
            .replace(
              '</head>',
              `<script>
                window.CURRENT_USER_ID = '${user.id}'
                window.CURRENT_USER_EMAIL = '${user.email}'
                console.log('[Lobby] User ID carregado:', window.CURRENT_USER_ID)
              </script>
              </head>`
            )
          setIframeContent(modifiedHtml)
        })
        .catch(err => console.error('Erro ao carregar lobby:', err))
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // ✅ Aguardar iframe carregar
  if (!iframeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-white text-lg">Carregando lobby...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '16px',
        backgroundColor: '#2e2e27',
        borderBottom: '1px solid #475569',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: '#e2e8f0', fontSize: '14px' }}>
          👤 {user.email}
        </div>
        <LogoutButton />
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <iframe
          srcDoc={iframeContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
          title="Lobby de Torneios"
        />
      </div>
    </div>
  )
}
