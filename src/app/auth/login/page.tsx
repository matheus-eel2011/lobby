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
        // ✅ Apenas navega - deixa o lobby carregar os dados
        router.push('/lobby')
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
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: 'url(/images/black-country-blues-bg.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay escuro para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo do formulário */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-black/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl p-8">
            {/* Logo/Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Pega Blinder</h1>
              <p className="text-gray-400 text-sm">Gerenciador de Torneios e Bankroll</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                />
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-semibold rounded-md transition duration-200 mt-6"
              >
                {loading ? 'Conectando...' : 'Entrar'}
              </button>
            </form>

            {/* Link para cadastro */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Não tem conta?{' '}
                <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              © 2026 Pega Blinder. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
