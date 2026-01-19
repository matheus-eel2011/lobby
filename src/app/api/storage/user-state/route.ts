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

    const { bankroll, ...otherState } = data

    const { data: result, error } = await supabase
      .from('user_states')
      .upsert(
        {
          user_id: userId,
          bankroll: bankroll || 0,
          state: otherState,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
