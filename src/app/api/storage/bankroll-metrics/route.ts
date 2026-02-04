import { createClient } from '@supabase/supabase-js';

// ✅ Adicione esta linha para evitar pré-renderização
export const dynamic = 'force-dynamic';

// ✅ Função helper para criar o cliente apenas quando necessário
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * POST /api/storage/bankroll-metrics
 * Salva ou atualiza métricas de bankroll para um usuário
 */
export async function POST(req: Request) {
  try {
    // ✅ Cria o cliente apenas quando a função é chamada
    const supabase = getSupabaseClient();
    
    console.log('[API] POST /bankroll-metrics');

    // ✅ STEP 1: Extrair dados do request
    const body = await req.json();
    const { metrics, userId } = body;

    // ✅ STEP 2: Validar dados obrigatórios
    if (!userId) {
      console.warn('[API] userId não fornecido');
      return Response.json(
        { success: false, error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    if (!metrics) {
      console.warn('[API] metrics não fornecido');
      return Response.json(
        { success: false, error: 'metrics é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[API] Salvando para userId:', userId);
    console.log('[API] Métricas recebidas:', metrics);

    // ✅ STEP 3: Verificar se registro já existe
    const { data: existing, error: checkError } = await supabase
      .from('bankroll_metrics')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    let result;

    // ✅ STEP 4a: Se existe, ATUALIZAR
    if (existing) {
      console.log('[API] Registro existe, atualizando...');
      result = await supabase
        .from('bankroll_metrics')
        .update({
          metrics: metrics,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

      if (result.error) throw result.error;
      console.log('[API] ✅ Métricas atualizadas:', result.data);
    }
    // ✅ STEP 4b: Se não existe, INSERIR
    else {
      console.log('[API] Registro não existe, inserindo...');
      result = await supabase
        .from('bankroll_metrics')
        .insert({
          user_id: userId,
          metrics: metrics
        })
        .select();

      if (result.error) throw result.error;
      console.log('[API] ✅ Métricas inseridas:', result.data);
    }

    // ✅ STEP 5: Retornar sucesso
    return Response.json(
      {
        success: true,
        data: result.data,
        message: existing ? 'Métricas atualizadas' : 'Métricas salvas com sucesso'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[API] ❌ Erro ao salvar métricas:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Erro ao salvar métricas'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/storage/bankroll-metrics?userId=xxx
 * Carrega métricas de bankroll de um usuário
 */
export async function GET(req: Request) {
  try {
    // ✅ Cria o cliente apenas quando a função é chamada
    const supabase = getSupabaseClient();
    
    console.log('[API] GET /bankroll-metrics');

    // ✅ STEP 1: Extrair userId da URL
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // ✅ STEP 2: Validar userId
    if (!userId) {
      console.warn('[API] userId não fornecido');
      return Response.json(
        { success: false, error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[API] Carregando para userId:', userId);

    // ✅ STEP 3: Buscar métricas no banco
    const { data, error } = await supabase
      .from('bankroll_metrics')
      .select('*')
      .eq('user_id', userId)
      .single();

    // ✅ STEP 4: Tratar erros
    if (error) {
      // Se não encontra, retorna sucesso com data nula
      if (error.code === 'PGRST116') {
        console.log('[API] Nenhuma métrica encontrada para este usuário');
        return Response.json(
          {
            success: true,
            data: null,
            message: 'Nenhuma métrica encontrada'
          },
          { status: 200 }
        );
      }
      throw error;
    }

    console.log('[API] ✅ Métricas carregadas:', data.metrics);

    // ✅ STEP 5: Retornar métricas
    return Response.json(
      {
        success: true,
        data: {
          metrics: data.metrics,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[API] ❌ Erro ao carregar métricas:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Erro ao carregar métricas'
      },
      { status: 500 }
    );
  }
}
