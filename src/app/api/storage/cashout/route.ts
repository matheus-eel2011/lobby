import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    if (!body) {
      return NextResponse.json({ error: 'Body vazio' }, { status: 400 })
    }

    let data
    try {
      data = JSON.parse(body)
    } catch (parseError) {
      console.error('[API] Erro ao fazer parse JSON:', body)
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }
    
    const userId = data.userId

    if (!userId) {
      return NextResponse.json({ error: 'userId não fornecido' }, { status: 400 })
    }

    console.log('[API] Salvando cashout para usuário:', userId, 'Dados:', data)

    const { data: result, error } = await supabase
      .from('cashouts')
      .insert({
        user_id: userId,
        amount: data.amount || 0,
        data: data
      })
      .select()

    if (error) {
      console.error('[API] Erro Supabase:', error)
      throw error
    }

    console.log('[API] Cashout salvo com sucesso:', result)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('[API] Erro:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
