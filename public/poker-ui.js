// public/poker-ui.js - BLOCO 3 + BLOCO 4 ADAPTADO
console.log('[UI] 🚀 Iniciando BLOCO 3 + 4...');

// ===== VARIÁVEIS GLOBAIS =====
window.allTournamentsData = [];
window.filteredTournaments = [];
window.registered = new Set();
window.selectedDays = new Set([1, 2, 3, 4, 5, 6, 0]);
window.apiOnline = false;
window.profiles = {};
window.sortColumn = null;
window.sortDirection = 'asc';
window.updateInterval = null;
window.bankrollChart = null;

// ===== FUNÇÕES UI (BLOCO 3) =====
window.calculateTournamentStatus = function calculateTournamentStatus(tournament) {
  const now
}
