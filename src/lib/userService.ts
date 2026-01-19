import { supabase } from './supabase'

export async function saveUserProfile(email: string, username?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          email: email,
          username: username || email.split('@')[0],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Erro ao salvar perfil:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return { success: true, data: data || null }
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error)
    return { success: false, error: error.message }
  }
}

export async function updateUserProfile(username: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        username: username,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error)
    return { success: false, error: error.message }
  }
}
