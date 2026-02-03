import { NextResponse } from 'next/server';
import { getTournaments } from './tournaments.js';

export async function GET(request) {
  try {
    console.log('[API] Loading tournaments...');
    
    // Chamar a função que retorna os torneios
    const tournaments = await getTournaments();
    
    console.log('[API] ✅ Loaded', tournaments.length, 'tournaments');
    
    return NextResponse.json(tournaments, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
    
  } catch (error) {
    console.error('[API] ❌ Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
