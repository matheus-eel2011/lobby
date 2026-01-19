import { supabase } from './supabase'

export async function saveUserState(stateData: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { bankroll, ...otherState } = stateData

    const { data, error } = await supabase
      .from('user_states')
      .upsert(
        {
          user_id: user.id,
          bankroll: bankroll || 0,
          state: otherState,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) throw error

    console.log('[Supabase] User state salvo:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('[Supabase] Erro ao salvar state:', error)
    return { success: false, error: error.message }
  }
}

export async function updateBankroll(amount: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('user_states')
      .update({
        bankroll: amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()

    if (error) throw error

    console.log('[Supabase] Bankroll atualizado:', amount)
    return { success: true, data }
  } catch (error: any) {
    console.error('[Supabase] Erro ao atualizar bankroll:', error)
    return { success: false, error: error.message }
  }
}

export async function saveCashout(cashoutData: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('cashouts')
      .insert({
        user_id: user.id,
        amount: cashoutData.amount || 0,
        data: cashoutData
      })
      .select()

    if (error) throw error

    console.log('[Supabase] Cashout salvo:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('[Supabase] Erro ao salvar cashout:', error)
    return { success: false, error: error.message }
  }
}

export async function saveUsersToStorage(usersList: any[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('users_data')
      .upsert(
        {
          user_id: user.id,
          users_list: usersList,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) throw error

    console.log('[Supabase] Users list salva:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('[Supabase] Erro ao salvar users:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserState() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('user_states')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    console.log('[Supabase] User state carregado:', data)
    return { success: true, data: data || null }
  } catch (error: any) {
    console.error('[Supabase] Erro ao carregar state:', error)
    return { success: false, error: error.message }
  }
}

export async function getCashoutHistory() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('cashouts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('[Supabase] Cashout history carregado:', data)
    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error('[Supabase] Erro ao carregar cashouts:', error)
    return { success: false, error: error.message }
  }
}

export async function getUsersList() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('users_data')
      .select('users_list')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    console.log('[Supabase] Users list carregado:', data)
    return { success: true, data: data?.users_list || [] }
  } catch (error: any) {
    console.error('[Supabase] Erro ao carregar users:', error)
    return { success: false, error: error.message }
  }
}
