import { selectRandomPlayerFromIE1 } from './data/selector.js';
import { players } from './data/players.js';

const today = new Date().toISOString().split('T')[0];
let selectedPlayer = null;
let incorrectPlayers = []; // Array para almacenar los jugadores incorrectos

// Verificar si ya existe un jugador seleccionado para hoy y asignarlo
if (localStorage.getItem(today)) {
    selectedPlayer = JSON.parse(localStorage.getItem(today));
    console.log('Jugador ya seleccionado para hoy:', selectedPlayer);
} else {
    // Si no hay un jugador seleccionado para hoy, usar selectRandomPlayerFromIE1
    selectedPlayer = selectRandomPlayerFromIE1();
    localStorage.setItem(today, JSON.stringify(selectedPlayer));
    console.log('Nuevo jugador seleccionado:', selectedPlayer);
}

document.addEventListener('DOMContentLoaded', () => {
    const classicBtn = document.getElementById('classic-btn');
    const searchContainer = document.getElementById('search-container');
    const searchBox = document.getElementById('search-box');
    const searchResults = document.getElementById('search-results');
    const incorrectPlayersList = document.getElementById('incorrect-players-list');

    classicBtn.addEventListener('click', () => {
        searchContainer.style.display = 'block';
    });

    searchBox.addEventListener('input', () => {
        const query = searchBox.value.toLowerCase();

        if (query.length < 2) {
            searchResults.innerHTML = '<li class="list-group-item">Introduce al menos dos caracteres para buscar.</li>';
            return;
        }

        const ie1Players = players.filter(player => player.Game === "IE1");
        const filteredPlayers = ie1Players.filter(player =>
            player.EnglishName.toLowerCase().includes(query) &&
            !incorrectPlayers.some(incorrectPlayer =>
                incorrectPlayer.EnglishName === player.EnglishName &&
                incorrectPlayer.Gender === player.Gender &&
                incorrectPlayer.Position === player.Position &&
                incorrectPlayer.Element === player.Element &&
                incorrectPlayer.EnglishTeam === player.EnglishTeam &&
                incorrectPlayer.Game === player.Game
            )
        );

        searchResults.innerHTML = '';
        filteredPlayers.forEach(player => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            
            const playerImg = document.createElement('img');
            playerImg.src = player.Sprite;
            playerImg.alt = player.EnglishName;
            playerImg.style.width = '50px';
            playerImg.style.marginRight = '10px';

            const playerText = document.createElement('span');
            playerText.textContent = `${player.EnglishName} (${player.EnglishTeam}, ${player.Game}, ${player.Gender}, ${player.Position}, ${player.Element})`;

            listItem.appendChild(playerImg);
            listItem.appendChild(playerText);

            listItem.addEventListener('click', () => {
                const isCorrect = (
                    player.EnglishName === selectedPlayer.EnglishName &&
                    player.Gender === selectedPlayer.Gender &&
                    player.Position === selectedPlayer.Position &&
                    player.Element === selectedPlayer.Element &&
                    player.EnglishTeam === selectedPlayer.EnglishTeam &&
                    player.Game === selectedPlayer.Game
                );

                if (isCorrect) {
                    searchContainer.style.display = 'none'; // Ocultar el selector
                    searchBox.disabled = true; // Deshabilitar el campo de búsqueda
                    listItem.style.backgroundColor = 'green';
                    listItem.style.color = 'white';

                    // Mostrar el personaje seleccionado en la lista de incorrectos
                    incorrectPlayers.push(selectedPlayer);
                    updateIncorrectPlayersList();
                } else {
                    listItem.style.backgroundColor = 'red';
                    listItem.style.color = 'white';
                    listItem.style.pointerEvents = 'none';

                    incorrectPlayers.push(player);
                    updateIncorrectPlayersList();
                }
            });

            searchResults.appendChild(listItem);
        });
    });

    function updateIncorrectPlayersList() {
        incorrectPlayersList.innerHTML = '';

        if (incorrectPlayers.length === 0) {
            return;
        }

        // Crear y agregar la cabecera de la tabla
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Jugador', 'Equipo', 'Juego', 'Género', 'Posición', 'Elemento'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear el cuerpo de la tabla
        const tbody = document.createElement('tbody');
        incorrectPlayers.slice().reverse().forEach(player => {
            const dataRow = document.createElement('tr');
            
            // Crear y añadir imágenes y celdas
            const playerImg = createImageCell(player.Sprite, player.EnglishName);
            const teamImg = createImageCell(player.TeamSprite);
            const genderImg = createImageCell(`images/genders/${player.Gender}.png`, 'Gender');
            const positionImg = createImageCell(`images/positions/${player.Position}.png`, 'Position');
            const elementImg = createImageCell(`images/elements/${player.Element}.png`, 'Element');
            const logoImg = createImageCell('images/logos/0.png', 'Game Logo');

            [playerImg, logoImg, teamImg, genderImg, positionImg, elementImg].forEach((img, index) => {
                const td = document.createElement('td');
                td.appendChild(img);
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                td.style.textAlign = 'center';

                // Establecer el color de fondo
                if (index === 0) {
                    td.style.backgroundColor = 'none'; // Jugador
                } else if (index === 1) {
                    td.style.backgroundColor = player.EnglishTeam === selectedPlayer.EnglishTeam ? 'green' : 'red'; // Equipo
                } else if (index === 2) {
                    td.style.backgroundColor = player.Game === selectedPlayer.Game ? 'green' : 'red'; // Juego
                } else if (index === 3) {
                    td.style.backgroundColor = player.Gender === selectedPlayer.Gender ? 'green' : 'red'; // Género
                } else if (index === 4) {
                    td.style.backgroundColor = player.Position === selectedPlayer.Position ? 'green' : 'red'; // Posición
                } else if (index === 5) {
                    td.style.backgroundColor = player.Element === selectedPlayer.Element ? 'green' : 'red'; // Elemento
                }

                dataRow.appendChild(td);
            });

            tbody.appendChild(dataRow);
        });
        table.appendChild(tbody);
        incorrectPlayersList.appendChild(table);
    }

    function createImageCell(src, alt) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '50px';
        img.style.height = '50px';
        return img;
    }
});
