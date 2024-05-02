import { Player, Game } from './jeux';

export class UndercoverGame {
    private game: Game;
    private undercoverRole: string;

    constructor(game: Game) {
        this.game = game;
        this.undercoverRole = '';
    }

    playUndercover() {
        this.game.players.forEach(player => {
            player.assignWord();
            player.hideWord();
        });

        this.game.players.forEach(player => {
            const synonym = prompt(`Entrez un synonyme pour votre mot (${player.role}) :`);
            if (synonym) {
                console.log(`${player.pseudo} a entré le synonyme : ${synonym}`);
            }
        });

        this.game.players.forEach(player => {
            console.log(`${player.pseudo} : ${player.getWord()}`);
        });
        this.handleElimination();
    }

    handleElimination() {
        // Ajoutez ici la logique pour gérer l'élimination d'un joueur.
    }
}

