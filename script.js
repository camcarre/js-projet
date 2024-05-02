function startGame() {
    var numPlayers = document.getElementById("numPlayers").value;
    var numMisterWhite = document.getElementById("numMisterWhite").value;
    var numUndercover = document.getElementById("numUndercover").value;

    if ((parseInt(numMisterWhite) + parseInt(numUndercover)) > numPlayers / 2) {
        alert("Il y a trop de rôles spéciaux. Le nombre total de 'Undercover' et 'Mister White' ne doit pas dépasser la moitié du nombre de joueurs.");
        return;
    }

    document.getElementById("startGameButton").style.display = 'none';
    document.getElementById("numPlayers").style.display = 'none';
    document.getElementById("numMisterWhite").style.display = 'none';
    document.getElementById("numUndercover").style.display = 'none';

    var labels = document.querySelectorAll('label[for=numPlayers], label[for=numMisterWhite], label[for=numUndercover]');
    for(var i = 0; i < labels.length; i++) {
        labels[i].style.display = 'none';
    }

    var displayNumPlayers = document.getElementById("displayNumPlayers");
    var displayNumMisterWhite = document.getElementById("displayNumMisterWhite");
    var displayNumUndercover = document.getElementById("displayNumUndercover");

    displayNumPlayers.textContent = "Nombre de joueurs : " + numPlayers;
    displayNumMisterWhite.textContent = "Nombre de Mister White : " + numMisterWhite;
    displayNumUndercover.textContent = "Nombre de Undercover : " + numUndercover;

    var pseudos = [];
    for (var i = 0; i < numPlayers; i++) {
        var pseudo = prompt("Entrez le pseudonyme du joueur " + (i + 1) + " :");
        pseudos.push(pseudo);
    }

    var undercoverWords = ["1", "2"];
    var basicWords = ["1", "2"];
    var cards = [];

    for (var i = 0; i < numUndercover; i++) {
        cards.push({role: "Undercover", word: undercoverWords[i]});
    }
    while (cards.length < pseudos.length - numMisterWhite) {
        cards.push({role: "Basique", word: basicWords[cards.length - numUndercover]});
    }
    for (var i = 0; i < numMisterWhite; i++) {
        cards.push({role: "Mister White"});
    }

    var playerButtons = document.getElementById("playerButtons");

    for (var i = 0; i < pseudos.length; i++) {
        var card = document.createElement("div");
        card.className = "card";

        var cardInner = document.createElement("div");
        cardInner.className = "card-inner";

        var cardFront = document.createElement("div");
        cardFront.className = "card-front";
        cardFront.textContent = "Voir le rôle de " + pseudos[i];

        var cardBack = document.createElement("div");
        cardBack.className = "card-back";
        cardBack.textContent = "Le rôle du joueur " + pseudos[i] + " est " + cards[i].role + " et son mot est " + cards[i].word;

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
    // Obtenez toutes les cartes et le bouton
    var cards = document.querySelectorAll('.card');
    var allCardsClickedButton = document.getElementById('allCardsClicked');

    // Initialisez un compteur pour suivre le nombre de cartes retournées
    var flippedCards = 0;

    // Ajoutez un écouteur d'événements à chaque carte
    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            // Si la carte n'est pas déjà retournée
            if (!card.classList.contains('flipped')) {
                // Ajoutez la classe 'flipped' à la carte
                card.classList.add('flipped');

                // Incrémentez le compteur lorsque la carte est retournée
                flippedCards++;

                // Si toutes les cartes ont été retournées, affichez le bouton
                if (flippedCards === cards.length) {
                    allCardsClickedButton.style.display = 'block';
                }
            }
        });
    });
    allCardsClickedButton.addEventListener('click', function() {
        // Redirigez vers la nouvelle page HTML
        window.location.href = 'clearplayer.html';
    });
}