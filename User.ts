import readline from 'readline';

function startGame(): void {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Veuillez saisir votre pseudo : ', (pseudo) => {
        console.log(`Bienvenue, ${pseudo} !`);

        rl.close();
    });
}

startGame();