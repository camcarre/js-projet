export class Player {
    private _pseudo: string;

    constructor(pseudo: string) {
        this._pseudo = pseudo;
    }

    get pseudo(): string {
        return this._pseudo;
    }
}

export class Card {
    private _role: string;
    private _word?: string;

    constructor(role: string, word?: string) {
        this._role = role;
        this._word = word;
    }

    get role(): string {
        return this._role;
    }

    get word(): string | undefined {
        return this._word;
    }
}

export class Game {
    private _numPlayers: number;
    private _numMisterWhite: number;
    private _numUndercover: number;
    private _players: Player[];
    private _cards: Card[];

    constructor(numPlayers: number, numMisterWhite: number, numUndercover: number) {
        this._numPlayers = numPlayers;
        this._numMisterWhite = numMisterWhite;
        this._numUndercover = numUndercover;
        this._players = [];
        this._cards = [];
    }

    private startGame() {
        const numPlayers = this._numPlayers;
        const numMisterWhite = this._numMisterWhite;
        const numUndercover = this._numUndercover;

        if ((numMisterWhite + numUndercover) > numPlayers / 2) {
            alert("Il y a trop de rôles spéciaux. Le nombre total de 'Undercover' et 'Mister White' ne doit pas dépasser la moitié du nombre de joueurs.");
            return;
        }

        const playerButtons = document.getElementById("playerButtons") as HTMLDivElement;
        playerButtons.innerHTML = "";

        for (let i = 0; i < this._players.length; i++) {
            const card = document.createElement("div");
            card.className = "card";

            const cardInner = document.createElement("div");
            cardInner.className = "card-inner";

            const cardFront = document.createElement("div");
            cardFront.className = "card-front";
            cardFront.textContent = "Voir le rôle de " + this._players[i].pseudo;

            const cardBack = document.createElement("div");
            cardBack.className = "card-back";
            cardBack.textContent = "Le rôle du joueur " + this._players[i].pseudo + " est " + this._cards[i].role + " et son mot est " + this._cards[i].word;

            cardInner.onclick = (function(cardInner, cardBack) {
                return function() {
                    cardInner.style.transform = "rotateY(180deg)";
                    cardBack.style.display = 'none'; 
                };
            })(cardInner, cardBack);

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            playerButtons.appendChild(card);
        }

        const cards = document.querySelectorAll('.card');
        const allCardsClickedButton = document.getElementById('allCardsClickedButton') as HTMLButtonElement;

        let flippedCards = 0;

        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                if (!card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    flippedCards++;

                    if (flippedCards === cards.length) {
                        allCardsClickedButton.style.display = 'block';
                    }
                }
            });
        });

        allCardsClickedButton.addEventListener('click', function() {
            window.location.href = 'clearplayer.html';
        });
    }

    public initializeGame(pseudos: string[]) {
        for (const pseudo of pseudos) {
            this._players.push(new Player(pseudo));
        }
        this.startGame();
    }
}


function startGame() {
    const startGameButton = document.getElementById("startGameButton") as HTMLButtonElement;
    const numPlayersInput = document.getElementById("numPlayers") as HTMLInputElement;
    const numMisterWhiteInput = document.getElementById("numMisterWhite") as HTMLInputElement;
    const numUndercoverInput = document.getElementById("numUndercover") as HTMLInputElement;
    
    const pseudos: string[] = [];
    
    const numPlayers = parseInt(numPlayersInput.value);
    const numMisterWhite = parseInt(numMisterWhiteInput.value);
    const numUndercover = parseInt(numUndercoverInput.value);

    // Création de l'instance de Game
    const game = new Game(numPlayers, numMisterWhite, numUndercover);
    
    // Initialisation du jeu
    game.initializeGame(pseudos);
    
    // Création de l'instance de UndercoverGame
    const undercoverGame = new UndercoverGame(game);

    // D'autres actions ou manipulations peuvent suivre ici...
}









