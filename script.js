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

    // Mostrar el contenedor de búsqueda al hacer clic en "Clásico"
    classicBtn.addEventListener('click', () => {
        searchContainer.style.display = 'block';
    });

    // Realizar búsqueda cuando el usuario introduce texto en el campo de búsqueda
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.toLowerCase();

        // Solo realizar búsqueda si se han introducido al menos dos caracteres
        if (query.length < 2) {
            searchResults.innerHTML = '<li class="list-group-item">Introduce al menos dos caracteres para buscar.</li>';
            return;
        }

        // Filtrar jugadores del juego "IE1"
        const ie1Players = players.filter(player => player.Game === "IE1");

        // Excluir los jugadores que ya están en la lista de incorrectos
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

        // Mostrar los resultados en la lista
        searchResults.innerHTML = '';
        filteredPlayers.forEach(player => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');

            // Crear la imagen del jugador
            const playerImg = document.createElement('img');
            playerImg.src = player.Sprite;
            playerImg.alt = player.EnglishName;
            playerImg.style.width = '50px'; // Ajusta el tamaño de la imagen según sea necesario
            playerImg.style.marginRight = '10px';

            // Crear el texto del jugador
            const playerText = document.createElement('span');
            playerText.textContent = `${player.EnglishName} (${player.EnglishTeam}, ${player.Game}, ${player.Gender}, ${player.Position}, ${player.Element})`;

            // Agregar la imagen y el texto al elemento li
            listItem.appendChild(playerImg);
            listItem.appendChild(playerText);

            // Agregar evento de clic para verificar si es el jugador seleccionado del día
            listItem.addEventListener('click', () => {
                // Comparar atributos individualmente
                const attributes = [
                    { key: 'EnglishName', value: player.EnglishName },
                    { key: 'EnglishTeam', value: player.EnglishTeam },
                    { key: 'Game', value: player.Game },
                    { key: 'Gender', value: player.Gender },
                    { key: 'Position', value: player.Position },
                    { key: 'Element', value: player.Element }
                ];

                const isCorrect = (attr) => player[attr.key] === selectedPlayer[attr.key];
                
                const colors = {
                    correct: 'green',
                    incorrect: 'red'
                };

                // Crear un nuevo elemento li para el jugador incorrecto con una tabla
                const incorrectListItem = document.createElement('li');
                incorrectListItem.classList.add('list-group-item');

                // Crear la tabla para mostrar los datos del jugador incorrecto
                const table = document.createElement('table');
                table.style.width = '100%'; // Hacer que la tabla ocupe todo el ancho del contenedor
                table.style.borderCollapse = 'collapse'; // Colapsar bordes para una apariencia más uniforme

                // Crear la fila del encabezado
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const headers = ['Jugador', 'Equipo', 'Juego', 'Género', 'Posición', 'Elemento'];
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    th.style.border = '1px solid #ddd'; // Agregar borde a las celdas
                    th.style.padding = '8px'; // Espaciado interno en las celdas
                    th.style.textAlign = 'center'; // Alineación del texto
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Crear la fila de datos
                const tbody = document.createElement('tbody');
                const dataRow = document.createElement('tr');

                // Crear imágenes para cada campo en lugar de texto
                attributes.forEach(attr => {
                    const td = document.createElement('td');
                    td.style.border = '1px solid #ddd'; // Agregar borde a las celdas
                    td.style.padding = '8px'; // Espaciado interno en las celdas
                    td.style.textAlign = 'center'; // Alineación del texto

                    // Crear imágenes para cada campo en lugar de texto
                    const img = document.createElement('img');
                    switch (attr.key) {
                        case 'EnglishName':
                            img.src = player.Sprite;
                            img.alt = player.EnglishName;
                            img.style.width = '50px'; // Ajustar el tamaño de la imagen
                            img.style.height = '50px'; // Ajustar la altura de la imagen
                            break;
                        case 'EnglishTeam':
                            img.src = player.TeamSprite; // Ruta de la imagen del equipo con espacios reemplazados
                            img.alt = 'Team Emblem';
                            img.style.width = '50px'; // Ajustar el tamaño de la imagen
                            img.style.height = '50px'; // Ajustar la altura de la imagen
                            break;
                        case 'Game':
                            img.src = 'images/logos/0.png'; // Ruta de la imagen del logo
                            img.alt = 'Game Logo';
                            img.style.width = '50px'; // Ajustar el tamaño de la imagen
                            img.style.height = '50px'; // Ajustar la altura de la imagen
                            break;
                        case 'Gender':
                            img.src = `images/genders/${player.Gender}.png`; // Ruta de la imagen del género
                            img.alt = 'Gender';
                            img.style.width = '50px'; // Ajustar el tamaño de la imagen
                            img.style.height = '50px'; // Ajustar la altura de la imagen
                            break;
                        case 'Position':
                            img.src = `images/positions/${player.Position}.png`; // Ruta de la imagen de la posición
                            img.alt = 'Position';
                            img.style.width = '50px'; // Ajustar el tamaño de la imagen
                            img.style.height = '50px'; // Ajustar la altura de la imagen
                            break;
                        case 'Element':
                            img.src = `images/elements/${player.Element}.png`; // Ruta de la imagen del elemento
                            img.alt = 'Element';
                            img.style.width = '50px'; // Ajustar el tamaño de la imagen
                            img.style.height = '50px'; // Ajustar la altura de la imagen
                            break;
                        default:
                            img.alt = '';
                            break;
                    }
                    td.appendChild(img);

                    // Establecer el color de fondo del td basado en la exactitud
                    td.style.backgroundColor = isCorrect(attr) ? colors.correct : colors.incorrect;
                    
                    dataRow.appendChild(td);
                });

                // Añadir el logo en la columna del "Juego"
                const logoImg = document.createElement('img');
                logoImg.src = 'images/logos/0.png'; // Ruta de la imagen del logo
                logoImg.alt = 'Game Logo';
                logoImg.style.width = '50px'; // Ajustar el tamaño de la imagen
                logoImg.style.height = '50px'; // Ajustar la altura de la imagen
                // const logoCell = document.createElement('td');
                // logoCell.appendChild(logoImg);
                // logoCell.style.border = '1px solid #ddd'; // Agregar borde a las celdas
                // logoCell.style.padding = '8px'; // Espaciado interno en las celdas
                // logoCell.style.textAlign = 'center'; // Alineación del texto
                // dataRow.appendChild(logoCell);

                tbody.appendChild(dataRow);
                table.appendChild(tbody);

                // Agregar la tabla al elemento li
                incorrectListItem.appendChild(table);
                incorrectPlayersList.appendChild(incorrectListItem);
            });

            searchResults.appendChild(listItem);
        });

        if (filteredPlayers.length === 0) {
            searchResults.innerHTML = '<li class="list-group-item">No se encontraron jugadores.</li>';
        }
    });
});
