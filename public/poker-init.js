console.log('[POKER] 🚀 Iniciando Bloco 1...');

let _pokerStorage = {
    buyins: {},
    cashouts: {},
    currentCashoutId: null,
    storage: {},
    _initialized: false,
    _initTimestamp: null
};

function validatePokerData(data) {
    if (!data || typeof data !== 'object') {
        console.warn('[POKER] ❌ Dados inválidos:', data);
        return false;
    }
    let unwrapped = data;
    if (data.state && typeof data.state === 'object' && !Array.isArray(data.state)) {
        if (data.state.state && typeof data.state.state === 'object') {
            unwrapped = data.state.state;
        } else {
            unwrapped = data.state;
        }
    }
    return unwrapped;
}

function updateAliases() {
    if (window.POKER) {
        window.buyins = window.POKER.buyins;
        window.cashouts = window.POKER.cashouts;
        window.currentCashoutId = window.POKER.currentCashoutId;
        console.log('[POKER] ✅ Aliases atualizados');
    }
}

window.POKER = {
    buyins: _pokerStorage.buyins,
    cashouts: _pokerStorage.cashouts,
    currentCashoutId: _pokerStorage.currentCashoutId,
    storage: _pokerStorage.storage,
    _initialized: _pokerStorage._initialized,
    _initTimestamp: _pokerStorage._initTimestamp
};

window.loadPokerData = function(userState) {
    console.log('[loadPokerData] Entrada recebida:', userState);
    
    if (!userState || !userState.state) {
        console.error('[loadPokerData] ❌ userState inválido');
        return false;
    }
    
    let pokerData = userState.state;
    
    if (pokerData && pokerData.state) {
        console.log('[loadPokerData] Desembrulhando dados aninhados...');
        pokerData = pokerData.state;
    }
    
    _pokerStorage.buyins = pokerData.buyins || {};
    _pokerStorage.cashouts = pokerData.cashouts || {};
    _pokerStorage.currentCashoutId = pokerData.currentCashoutId || null;
    _pokerStorage.storage = pokerData.storage || {};
    _pokerStorage._initialized = true;
    _pokerStorage._initTimestamp = new Date().toISOString();
    
    window.POKER.buyins = _pokerStorage.buyins;
    window.POKER.cashouts = _pokerStorage.cashouts;
    window.POKER.currentCashoutId = _pokerStorage.currentCashoutId;
    window.POKER.storage = _pokerStorage.storage;
    window.POKER._initialized = true;
    window.POKER._initTimestamp = _pokerStorage._initTimestamp;
    
    console.log('[loadPokerData] ✅ Dados carregados:', window.POKER);
    updateAliases();
    
    return true;
};

window.updateAliases = updateAliases;

window.POKER_DEBUG = {
    getStatus() {
        return {
            pokerExists: window.POKER !== undefined,
            pokerValue: window.POKER,
            buyinsCount: Object.keys(window.POKER?.buyins || {}).length,
            cashoutCount: Object.keys(window.POKER?.cashouts || {}).length,
            initialized: window.POKER?._initialized || false
        };
    },
    
    logStatus() {
        const status = this.getStatus();
        console.group('[POKER_DEBUG] Status Completo');
        console.table(status);
        console.log('window.POKER:', status.pokerValue);
        console.groupEnd();
    },
    
    reset() {
        _pokerStorage = {
            buyins: {},
            cashouts: {},
            currentCashoutId: null,
            storage: {},
            _initialized: false,
            _initTimestamp: null
        };
        window.POKER = { ..._pokerStorage };
        console.log('[POKER_DEBUG] ✅ Storage resetado');
    }
};

console.log('[POKER] ✅ Bloco 1 carregado com sucesso!');
console.log('[POKER] Status:', window.POKER_DEBUG.getStatus());
