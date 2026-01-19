import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = JSON.parse(body)
    
    const userId = data.userId

    if (!userId) {
      return NextResponse.json({ error: 'userId não fornecido' }, { status: 400 })
    }

    const { data: result, error } = await supabase
      .from('user_states')
      .update({
        bankroll: data.amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
