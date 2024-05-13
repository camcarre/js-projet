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
    let players = [];
    let playerList = [];
    let playerNames = players.map(player => player.name);

    if (roomId) {
        document.getElementById('start').innerText = "Rejoindre";
    }

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

    socket.on('player joined', (playerInfo) => {
        players.push(playerInfo);
    });

    socket.on('join room', (roomId) => {
        player.roomId = roomId;
        linkToShare.innerHTML = `<a href="${window.location.href}?room=${player.roomId}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
    });

    const joinRoom = function () {
        if (usernameInput.value !== "") {
            player.username = usernameInput.value;
            player.socketId = socket.id;
            player.roomId = this.dataset.room;
    
            socket.emit('playerData', player);
    
            userCard.hidden = true;
            waitingArea.classList.remove('d-none');
            roomsCard.classList.add('d-none');
        }
    }



    function restartGame(players = null) {
        if (player.host && !players) {
            player.turn = true;
            socket.emit('play again', player.roomId);
        }

        const cells = document.getElementsByClassName('cell');

        for (const cell of cells) {
            cell.innerHTML = '';
            cell.classList.remove('win-cell', 'text-danger');
        }

        turnMsg.classList.remove('alert-warning', 'alert-danger');

        if (!player.host) {
            player.turn = false;
        }

        player.win = false;

        if (players) {
            startGame(players);
        }
    }

    function showRestartArea() {
        if (player.host) {
            restartArea.classList.remove('d-none');
        }
    }

    function setTurnMessage(classToRemove, classToAdd, html) {
        turnMsg.classList.remove(classToRemove);
        turnMsg.classList.add(classToAdd);
        turnMsg.innerHTML = html;
    }

    socket.on('player joined', (players) => {
        startGame(players);
    });

    socket.on('play again', (players) => {
        restartGame(players);
    })

    function startGame(players) {
        restartArea.classList.add('d-none');
        waitingArea.classList.add('d-none');
        gameCard.classList.remove('d-none');
        turnMsg.classList.remove('d-none');

        const ennemyPlayer = players.find(p => p.socketId != player.socketId);
        ennemyUsername = ennemyPlayer.username;

        if (player.host && player.turn) {
            setTurnMessage('alert-info', 'alert-success', "C'est ton tour de jouer");
        } else {
            setTurnMessage('alert-success', 'alert-info', `C'est au tour de <b>${ennemyUsername}</b> de jouer`);
        }
    }

    function getPlayersNames(players) {
        const playersNames = players.map(player => player.name);
        return playersNames;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let roles = ['Villageois1', 'Villageois2', 'Mister White', 'Undercover'];
    let roleWords = {
        'Villageois1': 'Mot1',
        'Villageois2': 'Mot1',
        'Mister White': 'tu est le mister white',
        'Undercover': 'Mot2'
    };

    let rolesWithWords = roles.map(role => {
        return {
            role: role,
            word: roleWords[role]
        };
    });

    roles = roles.filter((role, index, self) => {
        return role !== 'Undercover' || index === self.indexOf('Undercover');
    });

    let misterWhiteCount = roles.filter(role => role === 'Mister White').length;
    if (misterWhiteCount > 1) {
        console.error(`Il y a ${misterWhiteCount} 'Mister White' dans le tableau de rôles. Il ne devrait y en avoir qu'un.`);
    }

    let undercoverCount = roles.filter(role => role === 'Undercover').length;
    if (undercoverCount > 1) {
        console.error(`Il y a ${undercoverCount} 'Undercover' dans le tableau de rôles. Il ne devrait y en avoir qu'un.`);
    }

    let villageois1Count = roles.filter(role => role === 'Villageois1').length;
    if (villageois1Count > 1) {
        console.error(`Il y a ${villageois1Count} 'Villageois1' dans le tableau de rôles. Il ne devrait y en avoir qu'un.`);
    }

    let villageois2Count = roles.filter(role => role === 'Villageois2').length;
    if (villageois2Count > 1) {
        console.error(`Il y a ${villageois2Count} 'Villageois2' dans le tableau de rôles. Il ne devrait y en avoir qu'un.`);
    }

    function assignRoles(players, roles) {
        let rolesCopy = [...roles];
    
        for (let i = rolesCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rolesCopy[i], rolesCopy[j]] = [rolesCopy[j], rolesCopy[i]];
        }
    
        for (let i = 0; i < players.length; i++) {
            players[i].role = rolesCopy[i];
            players[i].word = words[rolesCopy[i]];
            players[i].card = `${players[i].username}: ${rolesCopy[i]} ${players[i].word}`;
        }
    }




   // const words = {
    //    villageois: ["villageois1","villageois2","villageois3","villageois4","villageois5","villageois","villageois","villageois","villageois","villageois","villageois","villageois","villageois","villageois","villageois",],
      //  undercover: ["undercover1","undercover2","undercover3","undercover4","undercover5","undercover","undercover","undercover","undercover","undercover","undercover","undercover","undercover","undercover","undercover",],
   // };



    function createVoteButton(playerName) {
        const button = document.createElement('button');
        button.textContent = 'Vote Out';
        button.addEventListener('click', () => {
            votePlayerOut(players, playerName);
        });
        return button;
    }

    function updatePlayerRoles(players, currentUser) {
        const playerRolesElement = document.getElementById('player-roles');
        playerRolesElement.innerHTML = '';
        for (const player of players) {
            if (player.username === currentUser.username) {
                const playerRoleElement = document.createElement('div');
                playerRoleElement.textContent = `${player.username} - Rôle: ${player.role}`;
                playerRolesElement.appendChild(playerRoleElement);
            }
        }
    }

    socket.on('player voted out', (playerVotedOut) => {
    const playerElement = document.getElementById(playerVotedOut);
    if (playerElement) {
        playerElement.classList.add('eliminated');
    }
    });


    socket.on('start game', (players) => {
        players.forEach(player => {
            console.log(player.username);
        });

        assignRoles(players, roles);
        updatePlayerRoles(players, player);

        startGame(players);
    });