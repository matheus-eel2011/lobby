export async function registerUser(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      return { success: false, error: 'Falha ao registrar' }
    }
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao conectar' }
  }
}
