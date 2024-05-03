window.onload = function() {
    const cards = JSON.parse(localStorage.getItem('cards'));

    const cardsElement = document.getElementById('cards');

    for (let i = 0; i < cards.length; i++) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const cardInnerElement = document.createElement('div');
        cardInnerElement.className = 'card-inner';

        const cardFrontElement = document.createElement('div');
        cardFrontElement.className = 'card-front';
        cardFrontElement.textContent = 'Cliquez pour révéler le rôle';

        const cardBackElement = document.createElement('div');
        cardBackElement.className = 'card-back';
        cardBackElement.textContent = `Le rôle est ${cards[i].role} et le mot est ${cards[i].word}`;

        cardInnerElement.appendChild(cardFrontElement);
        cardInnerElement.appendChild(cardBackElement);

        cardElement.appendChild(cardInnerElement);

        const button = document.createElement('button');
        button.textContent = 'Éliminer le joueur';
        button.onclick = (() => {
            const currentCardElement = cardElement;
            const currentCard = cards[i];
            return () => {
                alert(`Le joueur a été éliminé. Son rôle était ${currentCard.role}`);
                currentCardElement.style.display = 'none';
            };
        })();

        cardElement.appendChild(button);

        cardsElement.appendChild(cardElement);
    }
};
