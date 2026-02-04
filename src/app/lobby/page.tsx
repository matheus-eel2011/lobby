'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'

export default function LobbyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [iframeContent, setIframeContent] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetch('/lobby/index.html')
        .then(res => res.text())
        .then(html => {
          const modifiedHtml = html
            .replace(
              '<script>',
              `<script>
                // ✅ GARANTIR USER ID ANTES DE TUDO
                window.CURRENT_USER_ID = "${user.id}";
                console.log('[Lobby] User ID carregado:', window.CURRENT_USER_ID);
                
                // ========================================
                // 🔧 INICIALIZAÇÃO PARA NOVOS USUÁRIOS
                // ========================================
                
                if (typeof window !== 'undefined') {
                  console.log('[Init] 🚀 Inicializando estruturas globais...');
                  
                  if (!window.registeredTournaments) {
                    window.registeredTournaments = new Map();
                    console.log('[Init] ✅ registeredTournaments inicializado');
                  }
                  
                  if (!window.selectedTournaments) {
                    window.selectedTournaments = new Map();
                    console.log('[Init] ✅ selectedTournaments inicializado');
                  }
                  
                  if (!window.filteredTournaments) {
                    window.filteredTournaments = [];
                    console.log('[Init] ✅ filteredTournaments inicializado');
                  }
                  
                  if (!window.allTournamentsData) {
                    window.allTournamentsData = [];
                    console.log('[Init] ✅ allTournamentsData inicializado');
                  }
                  
                  console.log('[Init] ✅ Todas estruturas inicializadas com sucesso');
                }
              `
            )
            // ✅ REMOVER linha que anula o User ID
            .replace('window.currentUserId = null', '')
            .replace('window.CURRENT_USER_ID = null', '')
          
          setIframeContent(modifiedHtml)
        })
        .catch(err => {
          console.error('Erro ao carregar lobby:', err)
        })
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif'
      }}>
        Carregando...
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!iframeContent) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif'
      }}>
        Carregando lobby...
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '10px 20px', 
        background: '#1a1a1a', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>👤 {user.email}</span>
        <LogoutButton />
      </div>

      <iframe
        srcDoc={iframeContent}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1
        }}
        title="Poker Lobby"
      />
    </div>
  )
}
