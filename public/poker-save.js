// public/poker-save.js - Funções de SAVE adaptadas
console.log('[Save] 🚀 Carregando funções de save...');

// ===== saveCashout (PRINCIPAL) =====
window.saveCashout = async function() {
  if (window.isLoadingData) {
    console.log('[Save] ⚠️ Bloqueado - carregando dados');
    return;
  }

  if (window.POKER.currentCashoutId === null) {
    console.log('[Save] Nenhum cashout selecionado');
    return;
  }

  try {
    // Capturar valores
    const baseBuyin = parseFloat(document.getElementById('modalBuyin').textContent.replace(',', '') || 0);
    const rebuyCount = parseInt(document.getElementById('rebuyCount').value || 0);
    const cashoutValue = parseFloat(document.getElementById('cashoutInput').value || 0);
    const totalInvested = baseBuyin * (1 + rebuyCount);

    console.log('[Save] Valores:', { baseBuyin, rebuyCount, cashoutValue, totalInvested });

    // COPIAR ESTADO ATUAL
    const updatedBuyins = { ...window.POKER.buyins };
    const updatedCashouts = { ...window.POKER.cashouts };

    // ATUALIZAR
    updatedBuyins[window.POKER.currentCashoutId] = {
      baseBuyin, rebuyCount, totalInvested
    };
    updatedCashouts[window.POKER.currentCashoutId] = cashoutValue;

    // USAR SETTER DO POKER
    window.POKER = {
      buyins: updatedBuyins,
      cashouts: updatedCashouts,
      currentCashoutId: window.POKER.currentCashoutId,
      storage: window.POKER.storage
    };

    // SALVAR NO SUPABASE
    if (window.CURRENT_USER_ID && typeof window.storageModule?.saveCashout === 'function') {
      await window.storageModule.saveCashout(cashoutValue, baseBuyin, rebuyCount, totalInvested);
    }

    // UI
    closeCashoutModal?.();
    showNotification?.('Cashout Registrado', `R$ ${cashoutValue.toFixed(2)} salvo!`, 'success');
    renderTable?.();
    updateControlDashboard?.();
    
    // Métricas (delay para DOM atualizar)
    setTimeout(() => {
      if (typeof saveBankrollMetrics === 'function') {
        saveBankrollMetrics();
      }
    }, 300);

    console.log('[Save] ✅ Cashout completo!');
  } catch (error) {
    console.error('[Save] Erro:', error);
    alert(`Erro: ${error.message}`);
  }
};

// ===== saveCurrentUserState =====
window.saveCurrentUserState = async function(data) {
  if (window.isLoadingData || !window.dataLoaded) {
    console.log('[Save] ⏸️ Bloqueado - aguardando dados');
    return;
  }

  const stateData = {
    ...data,
    buyins: window.POKER.buyins,
    cashouts: window.POKER.cashouts,
    registered: Array.from(window.registered || []),
    filteredTournaments: window.filteredTournaments || []
  };

  if (window.storageModule?.saveUserState) {
    await window.storageModule.saveUserState(stateData);
  }

  // Reconstruir registered dos cashouts
  const allIds = new Set(Object.keys(window.POKER.cashouts || {}));
  window.registered = allIds;
  console.log('[Save] registered reconstruído:', window.registered.size);
};

// ===== updateBankroll =====
window.updateBankroll = async function(amount) {
  if (window.storageModule?.updateBankroll) {
    return await window.storageModule.updateBankroll(amount);
  }
};

// ===== saveUsersToStorage =====
window.saveUsersToStorage = async function(users) {
  if (window.storageModule?.saveUsersToStorage) {
    return await window.storageModule.saveUsersToStorage(users);
  }
};

console.log('[Save] ✅ Todas funções de save carregadas!');
