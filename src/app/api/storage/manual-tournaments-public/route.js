import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // recomendado no server

  if (!url || !key) {
    throw new Error('ENV faltando: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('manual_tournaments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const supabase = getSupabase();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Body JSON inválido' }, { status: 400 });
    }

    const name = String(body.name || '').trim();
    const date = String(body.date || '').trim(); // YYYY-MM-DD
    const time = String(body.time || '').trim(); // HH:MM

    if (!name || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: date, time, name' },
        { status: 400 }
      );
    }

    const row = {
      date,
      time,
      name,
      site: body.site || 'Manual',
      type: body.type || 'REG',
      buyin: Number(body.buyin || 0),
      guaranteed: Number(body.guaranteed || 0),
      field: Number(body.field || 0),
      late_reg: Number(body.lateReg || 0),
      priority: body.priority || 'medium'
    };

    const { data, error } = await supabase
      .from('manual_tournaments')
      .insert(row)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
