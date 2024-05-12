const player = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    symbol: "X",
    turn: false,
    win: false
};

const socket = io();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('room');

if (roomId) {
    document.getElementById('start').innerText = "Rejoindre";
}

const usernameInput = document.getElementById('username');

const gameCard = document.getElementById('game-card');
const userCard = document.getElementById('user-card');

const restartArea = document.getElementById('restart-area');
const waitingArea = document.getElementById('waiting-area');

const roomsCard = document.getElementById('rooms-card');
const roomsList = document.getElementById('rooms-list');

const turnMsg = document.getElementById('turn-message');
const linkToShare = document.getElementById('link-to-share');

let ennemyUsername = "";

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if (rooms.length > 0) {
        rooms.forEach(room => {
            if (room.players.length !== 4) {
                html += `<li class="list-group-item d-flex justify-content-between">
                            <p class="p-0 m-0 flex-grow-1 fw-bold">Salon de ${room.players[0].username} - ${room.id}</p>
                            <button class="btn btn-sm btn-success join-room" data-room="${room.id}">Rejoindre</button>
                        </li>`;
            }
        });
    }

    if (html !== "") {
        roomsCard.classList.remove('d-none');
        roomsList.innerHTML = html;

        for (const element of document.getElementsByClassName('join-room')) {
            element.addEventListener('click', joinRoom, false)
        }
    }
});

$("#form").on('submit', function (e) {
    e.preventDefault();

    player.username = usernameInput.value;

    if (roomId) {
        player.roomId = roomId;
    } else {
        player.host = true;
        player.turn = true;
    }

    player.socketId = socket.id;

    userCard.hidden = true;
    waitingArea.classList.remove('d-none');
    roomsCard.classList.add('d-none');

    socket.emit('playerData', player);
});

$(".cell").on("click", function (e) {
    const playedCell = this.getAttribute('id');

    if (this.innerText === "" && player.turn) {
        player.playedCell = playedCell;

        this.innerText = player.symbol;

        player.win = calculateWin(playedCell);
        player.turn = false;

        socket.emit('play', player);
    }
});

$("#restart").on('click', function () {
    restartGame();
})

socket.on('join room', (roomId) => {
    player.roomId = roomId;
    linkToShare.innerHTML = `<a href="${window.location.href}?room=${player.roomId}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
});



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const roles = ['Undercover', 'Mister White', 'Villageois', 'Villageois'];

const words = {
'words': [
    ["Chien", "Chat", ], ["Oiseau", "Renard", ], ["Lapin", "Souris", ], ["Tortue", "Hibou", ], ["Papillon", "Faucon", ],
    ["Pizza", "Frites", ], ["Sushi", "Salade", ], ["Pain", "Banane", ], ["Pomme", "Chocolat", ], ["Gâteau", "Café", ],
    ["Plage", "Ville", ], ["Désert", "Île", ], ["Train", "Bus", ], ["Europe", "Amérique", ], ["Australie", "Lune", ],
    ["Football", "Tennis", ], ["Natation", "Course", ], ["Boxe", "Escalade", ], ["Surf", "Hockey", ], ["Baseball", "Volleyball",]
],

}
const wordList = words.words;

function assignWords(players, roles, words) {
    // Mélangez la liste de mots
    shuffle(words);

    for (let i = 0; i < players.length; i++) {
        players[i].role = roles[i];
        if (players[i].role === 'Villageois') {
            players[i].word = words[0][0]; // Premier mot du premier tableau
        } else if (players[i].role === 'Undercover') {
            players[i].word = words[0][1]; // Deuxième mot du premier tableau
        } else if (players[i].role === 'Mister White') {
            players[i].word = 'mister white'; // Mot pour Mister White
        }
    }
}