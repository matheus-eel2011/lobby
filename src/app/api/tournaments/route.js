// src/app/api/tournaments/route.js
import { getTournaments } from './tournaments.js';

export async function GET(request) {
  try {
    const tournaments = await getTournaments();
    
    return new Response(JSON.stringify(tournaments), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=30, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar torneios:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

