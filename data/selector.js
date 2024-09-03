import { getHistory, saveHistory } from './history.js';
import { players } from './players.js';

export function selectRandomPlayerFromIE1() {
    const today = new Date().toISOString().split('T')[0];
    const history = getHistory();

    // Verificar si ya existe un jugador seleccionado para el día actual
    const existingEntry = history.find(entry => entry.date === today);
    if (existingEntry) {
        console.log('Jugador ya seleccionado para hoy:', existingEntry.player);
        return existingEntry.player;
    }

    // Filtrar los jugadores que pertenecen al juego "IE1"
    const ie1Players = players.filter(player => player.Game === "IE1");

    // Seleccionar un jugador aleatorio del array filtrado
    const randomPlayer = ie1Players[Math.floor(Math.random() * ie1Players.length)];

    // Guardar el jugador seleccionado junto con la fecha en history
    history.push({ date: today, player: randomPlayer });
    saveHistory(history);

    console.log('Jugador seleccionado:', randomPlayer);

    return randomPlayer;
}
