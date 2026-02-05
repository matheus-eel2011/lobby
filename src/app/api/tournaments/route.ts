import { NextResponse } from 'next/server'
import { getTournaments } from './tournaments.js'

export const dynamic = 'force-dynamic'

function safePositiveInt(value: string | null, fallback: number) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  const i = Math.floor(n)
  return i > 0 ? i : fallback
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function isValidYYYYMMDD(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

function priorityScore(p?: string) {
  switch (p) {
    case 'very-high': return 5
    case 'high': return 4
    case 'medium': return 3
    case 'low': return 2
    case 'very-low': return 1
    default: return 0
  }
}

/**
 * Retorna YYYY-MM-DD no timezone America/Sao_Paulo usando Intl (Node runtime).
 */
function formatYYYYMMDDInTZ(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const y = parts.find(p => p.type === 'year')?.value
  const m = parts.find(p => p.type === 'month')?.value
  const d = parts.find(p => p.type === 'day')?.value
  return `${y}-${m}-${d}`
}

/**
 * Monta um Set com os últimos N dias (incluindo hoje) no TZ escolhido.
 * Ex: days=2 => hoje + ontem
 */
function buildLastDaysSet(days: number, timeZone: string) {
  const set = new Set<string>()
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const dt = new Date(now)
    dt.setDate(now.getDate() - i)
    set.add(formatYYYYMMDDInTZ(dt, timeZone))
  }

  return set
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const page = safePositiveInt(url.searchParams.get('page'), 1)
    const limitRaw = safePositiveInt(url.searchParams.get('limit'), 200)
    const limit = clamp(limitRaw, 10, 500)

    // ✅ padrão: últimos 2 dias
    const daysRaw = safePositiveInt(url.searchParams.get('days'), 2)
    const days = clamp(daysRaw, 1, 7)

    // (opcional) permitir passar um dia fixo via ?date=YYYY-MM-DD
    const dateParam = url.searchParams.get('date')
    const timeZone = 'America/Sao_Paulo'

    const allowedDates = (dateParam && isValidYYYYMMDD(dateParam))
      ? new Set([dateParam])
      : buildLastDaysSet(days, timeZone)

    const tournaments = await getTournaments()

    const filtered = tournaments.filter((t: any) => {
      const d = t?.date
      return typeof d === 'string' && allowedDates.has(d)
    })

    filtered.sort((a: any, b: any) => {
      // data desc (mais recente primeiro)
      const d = String(b.date || '').localeCompare(String(a.date || ''))
      if (d !== 0) return d

      // prioridade desc
      const pa = priorityScore(a.priority)
      const pb = priorityScore(b.priority)
      if (pa !== pb) return pb - pa

      // hora asc
      return String(a.time || '').localeCompare(String(b.time || ''))
    })

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const pageClamped = clamp(page, 1, totalPages)

    const from = (pageClamped - 1) * limit
    const to = from + limit
    const items = filtered.slice(from, to)

    return NextResponse.json(
      {
        success: true,
        days,
        date: (dateParam && isValidYYYYMMDD(dateParam)) ? dateParam : null,
        tournaments: items,
        pagination: {
          page: pageClamped,
          limit,
          total,
          totalPages,
          hasNext: pageClamped < totalPages,
          hasPrev: pageClamped > 1,
        },
      },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
        },
      }
    )
  } catch (error: any) {
    console.error('[API] ❌ Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed', tournaments: [], pagination: null },
      { status: 200 }
    )
  }
}
