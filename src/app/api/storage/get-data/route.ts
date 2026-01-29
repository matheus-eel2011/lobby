import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId não fornecido' }, { status: 400 })
    }

    // Buscar user_states
    const { data: userState } = await supabase
      .from('user_states')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Buscar cashouts
    const { data: cashouts } = await supabase
      .from('cashouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Buscar users_data
    const { data: usersData } = await supabase
      .from('users_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    // ✅ NOVO: Processar torneios registrados
    const registeredTournaments = []
    
    if (userState?.state?.state) {
      const state = userState.state.state
      
      if (state.cashouts && typeof state.cashouts === 'object') {
        for (const [tournamentId, cashoutAmount] of Object.entries(state.cashouts)) {
          if (cashoutAmount !== undefined) {
            const buyin = state.buyins?.[tournamentId] || {}
            const invested = buyin.totalInvested || buyin.baseBuyin || 0
            
            registeredTournaments.push({
              id: parseInt(tournamentId),
              tournamentId: parseInt(tournamentId),
              investido: invested,
              cashout: cashoutAmount,
              lucro: (cashoutAmount as number) - invested
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        userState: userState || {},
        cashouts: cashouts || [],
        usersData: usersData || {},
        registeredTournaments,   
        state: userState?.state?.state || {
          buyins: {},
          cashouts: {},
          registeredCount: registeredTournaments.length
        }
      }
    })
  } catch (error: any) {
    console.error('[API] Erro ao buscar dados:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
