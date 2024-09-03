// history.js
const HISTORY_KEY = 'history';

// Función para obtener el historial desde localStorage
export function getHistory() {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

// Función para guardar el historial en localStorage
export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
