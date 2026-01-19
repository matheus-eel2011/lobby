'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/lib/auth'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      const result = await logoutUser()
      if (result.success) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition duration-200"
    >
      {loading ? 'Saindo...' : 'Logout'}
    </button>
  )
}
