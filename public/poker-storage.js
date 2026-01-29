// public/poker-storage.js
console.log('[Storage] 🚀 Iniciando BLOCO 2');

// Flags globais de controle
window.isLoadingData = false;
window.dataLoaded = false;

// --- FUNÇÕES DE MÉTRICAS DE BANKROLL ---

window.saveBankrollMetrics = async function saveBankrollMetrics() {
  if (!window.CURRENT_USER_ID) {
    console.log('[Storage] User ID não disponível para salvar métricas');
    return;
  }

  try {
    const metrics = {
      totalTournaments: parseInt(document.getElementById('bankrollTotalTournaments')?.textContent || 0),
      avgBuyin: parseFloat(document.getElementById('bankrollAvgBuyin')?.textContent?.replace('$', '') || 0),
      totalProfit: parseFloat(document.getElementById('bankrollTotalProfit')?.textContent?.replace('$', '') || 0),
      roi: parseFloat(document.getElementById('bankrollROI')?.textContent?.replace('%', '') || 0),
      itm: parseFloat(document.getElementById('bankrollITM')?.textContent?.replace('%', '') || 0),
      prizeTotal: parseFloat(document.getElementById('bankrollPrizeTotal')?.textContent?.replace('$', '') || 0),
      currentBank: parseFloat(document.getElementById('bankrollCurrentBank')?.textContent?.replace('$', '') || 0),
      idealABI: parseFloat(document.getElementById('bankrollIdealABI')?.textContent?.replace('$', '') || 0),
      initialBank: parseFloat(document.getElementById('bankrollInitialBank')?.value || 1000),
      safetyFactor: parseFloat(document.getElementById('bankrollSafetyFactor')?.value || 400),
      timestamp: new Date().toISOString()
    };

    console.log('[Storage] Salvando métricas de bankroll:', metrics);

    const payload = {
      metrics,
      userId: window.CURRENT_USER_ID
    };

    const response = await fetch('/api/storage/bankroll-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('[Storage] ✅ Métricas salvas:', result);
    return result;
  } catch (error) {
    console.error('[Storage] Erro ao salvar métricas:', error);
  }
};

window.loadBankrollMetrics = async function loadBankrollMetrics() {
  if (!window.CURRENT_USER_ID) {
    console.log('[Storage] User ID não disponível para carregar métricas');
    return null;
  }

  try {
    const response = await fetch(`/api/storage/bankroll-metrics?userId=${window.CURRENT_USER_ID}`);
    const result = await response.json();

    if (result.success && result.data && result.data.metrics) {
      console.log('[Storage] ✅ Métricas carregadas:', result.data.metrics);
      return result.data.metrics;
    }

    console.log('[Storage] Nenhuma métrica encontrada');
    return null;
  } catch (error) {
    console.error('[Storage] Erro ao carregar métricas:', error);
    return null;
  }
};

window.restoreBankrollMetricsUI = function restoreBankrollMetricsUI(metrics) {
  if (!metrics) return;
  try {
    document.getElementById('bankrollTotalTournaments').textContent = metrics.totalTournaments;
    document.getElementById('bankrollAvgBuyin').textContent = '$' + metrics.avgBuyin.toFixed(2);

    const profitEl = document.getElementById('bankrollTotalProfit');
    profitEl.textContent = '$' + metrics.totalProfit.toFixed(2);
    profitEl.style.color = metrics.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';

    document.getElementById('bankrollROI').textContent = metrics.roi.toFixed(2) + '%';
    document.getElementById('bankrollITM').textContent = metrics.itm.toFixed(2) + '%';
    document.getElementById('bankrollPrizeTotal').textContent = '$' + metrics.prizeTotal.toFixed(2);
    document.getElementById('bankrollIdealABI').textContent = '$' + metrics.idealABI.toFixed(2);

    const currentBankEl = document.getElementById('bankrollCurrentBank');
    currentBankEl.textContent = '$' + metrics.currentBank.toFixed(2);
    currentBankEl.style.color = metrics.currentBank >= metrics.initialBank ? 'var(--success)' : 'var(--danger)';

    document.getElementById('bankrollInitialBank').value = metrics.initialBank;
    document.getElementById('bankrollSafetyFactor').value = metrics.safetyFactor;

    console.log('[Storage] ✅ Métricas restauradas na UI');
  } catch (error) {
    console.error('[Storage] Erro ao restaurar métricas:', error);
  }
};

// --- STORAGE MODULE BÁSICO ---

window.storageModule = {
  async saveUserState(data) {
    if (!window.CURRENT_USER_ID) {
      console.warn('[Storage] User ID não disponível');
      return null;
    }
    const payload = {
      userId: window.CURRENT_USER_ID,
      state: data
    };
    try {
      const response = await fetch('/api/storage/user-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('[Storage] ✅ Estado do usuário salvo:', result);
      return result;
    } catch (error) {
      console.error('[Storage] Erro ao salvar estado do usuário:', error);
      return null;
    }
  },

  async getUserData() {
    if (!window.CURRENT_USER_ID) {
      console.warn('[Storage] User ID não disponível para carregar dados');
      return null;
    }
    try {
      const response = await fetch(`/api/storage/get-data?userId=${window.CURRENT_USER_ID}`);
      const result = await response.json();
      console.log('[Storage] Resposta get-data:', result);
      return result;
    } catch (error) {
      console.error('[Storage] Erro ao carregar dados do usuário:', error);
      return null;
    }
  }
};

window.storageModule.saveCashout = async function(cashoutValue, baseBuyin, rebuyCount, totalInvested) {
  if (!window.CURRENT_USER_ID) {
    console.warn('[Storage] User ID não disponível');
    return;
  }

  try {
    // 1️⃣ CRIAR DADOS DO CASHOUT
    const cashoutData = {
      amount: Number(cashoutValue) || 0,
      baseBuyin: Number(baseBuyin) || 0,
      rebuyCount: Number(rebuyCount) || 0,
      totalInvested: Number(totalInvested) || 0,
      timestamp: new Date().toISOString(),
      userId: window.CURRENT_USER_ID
    };

    console.log('[Storage] Enviando cashout:', cashoutData);

    // 2️⃣ SALVAR CASHOUT INDIVIDUAL
    const response = await fetch('/api/storage/cashout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cashoutData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('[Storage] ✅ Cashout salvo no endpoint:', result);
    
    // 3️⃣ SINCRONIZAR ESTADO COMPLETO (opcional)
    if (typeof window.saveCurrentUserState === 'function') {
      await window.saveCurrentUserState({
        buyins: window.POKER?.buyins || window.buyins,
        cashouts: window.POKER?.cashouts || window.cashouts
      });
    }
    
    return result;
  } catch (error) {
    console.error('[Storage] Erro ao salvar cashout:', error);
    throw error;
  }
};

// --- INICIALIZAÇÃO BÁSICA ---

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Init] DOM carregado; iniciando fluxo de storage');

  // aguardar CURRENT_USER_ID
  let attempts = 0;
  while (!window.CURRENT_USER_ID && attempts < 50) {
    await new Promise(r => setTimeout(r, 100));
    attempts++;
  }
  console.log('[Init] CURRENT_USER_ID:', window.CURRENT_USER_ID);

  // carregar user-state
  const resp = await window.storageModule.getUserData();
  const userState = resp?.data?.userState;
  if (userState && typeof window.loadPokerData === 'function') {
    window.loadPokerData(userState);
  }

  // carregar métricas
  const savedMetrics = await window.loadBankrollMetrics();
  if (savedMetrics) {
    window.restoreBankrollMetricsUI(savedMetrics);
  }

  console.log('[Init] ✅ Storage + métricas inicializados');
});
