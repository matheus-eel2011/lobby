'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/auth/login')
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #2196F3',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
            🎰 PEGA BLINDER LOBBY
          </h1>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  👤 {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                  display: 'inline-block'
                }}>
                  Login
                </Link>
                <Link href="/auth/signup" style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                  display: 'inline-block'
                }}>
                  Cadastro
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        {user ? (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#2196F3', marginBottom: '20px' }}>
              ✅ Bem-vindo, {user.email}!
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
              Você está autenticado no sistema.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <Link href="/dashboard" style={{
                backgroundColor: '#2196F3',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                transition: 'background-color 0.3s'
              }}>
                📊 Dashboard
              </Link>
              <Link href="/verify-email" style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                transition: 'background-color 0.3s'
              }}>
                ✉️ Verificar Email
              </Link>
            </div>

            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <h3 style={{ marginTop: 0 }}>Informações da Conta:</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email Confirmado:</strong> {user.email_confirmed_at ? '✅ Sim' : '⏳ Pendente'}</p>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#666', marginBottom: '30px' }}>
              Bem-vindo ao PEGA BLINDER LOBBY
            </h2>
            <p style={{ color: '#999', marginBottom: '40px', fontSize: '16px' }}>
              Faça login ou cadastre-se para começar
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <Link href="/auth/login" style={{
                backgroundColor: '#2196F3',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}>
                🔐 Login
              </Link>
              <Link href="/auth/signup" style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}>
                ✏️ Cadastro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
