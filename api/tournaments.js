// ===== CARREGAR DADOS DA API (CORRIGIDO) =====
async function loadTournamentsFromAPI() {
    try {
        console.log('🔄 Carregando dados da API...');
        const response = await fetch('/api/tournaments');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Resposta da API recebida:', data);
        
        // Normaliza os dados
        let tournaments = Array.isArray(data) ? data : (data.tournaments || data.data || []);
        
        if (tournaments.length === 0) {
            throw new Error('Nenhum torneio encontrado na resposta');
        }
        
        // ✅ CORRIGIDO: Usar date da API direto
        tournaments = tournaments.map((t, idx) => ({
            id: t.id || idx + 1,
            time: t.time || "00:00",
            date: t.date || "2026-01-07",  // ✅ Usar date da API (já em YYYY-MM-DD)
            site: t.site || "GGPoker",
            name: t.name || "Torneio",
            type: (t.type || "REGULAR").toUpperCase(),
            buyin: parseFloat(t.buyin || 0),
            guaranteed: parseFloat(t.guaranteed || 0),
            field: parseInt(t.field || 0),
            roi: parseFloat(t.roi || 0),
            lateReg: parseInt(t.lateReg || 0),
            status: t.status || "Aberto",
            priority: t.priority || "medium",
            // ✅ ADICIONADO: dateFormatted para exibição em português
            dateFormatted: formatDateToBR(t.date)
        }));
        
        console.log('✅ Torneios carregados da API:', tournaments.length);
        updateAPIStatus(true);
        return tournaments;
        
    } catch (error) {
        console.error('❌ Erro ao carregar API:', error.message);
        updateAPIStatus(false);
        return [];
    }
}

// ===== FUNÇÃO PARA FORMATAR DATA PARA EXIBIÇÃO =====
function formatDateToBR(dateString) {
    // "2026-01-07" → "07/01/2026"
    if (!dateString || typeof dateString !== 'string') return '';
    
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// ===== FUNÇÃO PARA COMPARAR DATAS (MANTÉM ISO) =====
function isSameDate(date1, date2) {
    // Compara datas em formato ISO
    return date1?.split('T')[0] === date2?.split('T')[0];
}

// ===== FUNÇÃO PARA FILTRAR POR DATA =====
function filterTournamentsByDate(tournaments, targetDate) {
    // targetDate em formato YYYY-MM-DD
    return tournaments.filter(t => t.date === targetDate);
}
