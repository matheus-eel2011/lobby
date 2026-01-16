# Script de Setup - Sistema de Autenticação
# Copie e execute este script no PowerShell na raiz do seu projeto

# Cores para output
$green = "`e[32m"
$yellow = "`e[33m"
$red = "`e[31m"
$reset = "`e[0m"

Write-Host "$green✓ Iniciando setup de autenticação...$reset`n"

# ===========================
# 1. Criar lib/supabase.ts
# ===========================
Write-Host "$yellow[1/5]$reset Criando lib/supabase.ts..."

$supabaseCode = @'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
'@

# Criar pasta lib se não existir
if (-not (Test-Path "lib")) {
    New-Item -ItemType Directory -Path "lib" | Out-Null
}

$supabaseCode | Out-File -FilePath "lib/supabase.ts" -Encoding UTF8
Write-Host "$green✓ lib/supabase.ts criado$reset`n"

# ===========================
# 2. Criar lib/auth.ts
# ===========================
Write-Host "$yellow[2/5]$reset Criando lib/auth.ts..."

$authCode = @'
import { supabase } from './supabase'

export async function registerUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    return null
  }
}
'@

$authCode | Out-File -FilePath "lib/auth.ts" -Encoding UTF8
Write-Host "$green✓ lib/auth.ts criado$reset`n"

# ===========================
# 3. Criar app/auth/login/page.tsx
# ===========================
Write-Host "$yellow[3/5]$reset Criando app/auth/login/page.tsx..."

$loginCode = @'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginUser } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginUser(email, password)
      
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Falha ao fazer login')
      }
    } catch (err: any) {
      setError('Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>
          Entrar
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Senha:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#2196F3',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Não tem conta?{' '}
          <Link href="/auth/register" style={{ color: '#2196F3', textDecoration: 'none' }}>
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
'@

# Criar pasta se não existir
if (-not (Test-Path "app/auth/login")) {
    New-Item -ItemType Directory -Path "app/auth/login" -Force | Out-Null
}

$loginCode | Out-File -FilePath "app/auth/login/page.tsx" -Encoding UTF8
Write-Host "$green✓ app/auth/login/page.tsx criado$reset`n"

# ===========================
# 4. Criar app/auth/register/page.tsx
# ===========================
Write-Host "$yellow[4/5]$reset Criando app/auth/register/page.tsx..."

$registerCode = @'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '@/lib/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const result = await registerUser(email, password)
      
      if (result.success) {
        setSuccess('Cadastro realizado! Verifique seu email para confirmar.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setError(result.error || 'Falha ao registrar')
      }
    } catch (err: any) {
      setError('Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>
          Cadastrar
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#efe',
            color: '#3c3',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Senha:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Confirmar Senha:
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Já tem conta?{' '}
          <Link href="/auth/login" style={{ color: '#2196F3', textDecoration: 'none' }}>
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
'@

# Criar pasta se não existir
if (-not (Test-Path "app/auth/register")) {
    New-Item -ItemType Directory -Path "app/auth/register" -Force | Out-Null
}

$registerCode | Out-File -FilePath "app/auth/register/page.tsx" -Encoding UTF8
Write-Host "$green✓ app/auth/register/page.tsx criado$reset`n"

# ===========================
# 5. Verificar .env.local
# ===========================
Write-Host "$yellow[5/5]$reset Verificando .env.local..."

if (Test-Path ".env.local") {
    Write-Host "$green✓ .env.local encontrado$reset`n"
} else {
    Write-Host "$red✗ .env.local NÃO ENCONTRADO!$reset"
    Write-Host "$yellow Crie o arquivo .env.local com:$reset`n"
    Write-Host 'NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co'
    Write-Host 'NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui'
    Write-Host 'NEXTAUTH_URL=http://localhost:3000'
    Write-Host 'NEXTAUTH_SECRET=sua-chave-secreta-aqui'
    Write-Host ""
}

# ===========================
# Resumo Final
# ===========================
Write-Host "`n$green════════════════════════════════════════════$reset"
Write-Host "$green✓ SETUP COMPLETO!$reset"
Write-Host "$green════════════════════════════════════════════$reset`n"

Write-Host "$yellow Arquivos criados:$reset"
Write-Host "  ✓ lib/supabase.ts"
Write-Host "  ✓ lib/auth.ts"
Write-Host "  ✓ app/auth/login/page.tsx"
Write-Host "  ✓ app/auth/register/page.tsx`n"

Write-Host "$yellow Próximos passos:$reset"
Write-Host "  1. Verifique .env.local com variáveis reais"
Write-Host "  2. Execute: npm run dev"
Write-Host "  3. Acesse: http://localhost:3000/auth/login`n"

Write-Host "$green Tudo pronto! 🚀$reset`n"
