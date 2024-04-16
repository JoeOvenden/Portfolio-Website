
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

class Banner {
    constructor() {
        this.cardId = 0;
        this.cards = document.getElementsByClassName("project-card");
        this.currentCard = this.cards[0];
        this.currentCard.style.display = "block";
        this.setupButtons();
        this.direction = 1;             // 1 means getting the card to the right, -1 means getting the card to the left.
    }

    moveElement(e, percentageChange) {
        let currentRight = parseInt(e.style.right) || 0;
        e.style.right = (currentRight + percentageChange) + '%';
    }

    moveCards() {
    }

    step(timeStamp) {
        let finished = false;
        let timeSinceLastTimeStamp = 0;
        if (this.lastTimeStamp != -1) {
            timeSinceLastTimeStamp = timeStamp - this.lastTimeStamp;
        }

        this.lastTimeStamp = timeStamp;
        let percentChange = (timeSinceLastTimeStamp / 2000) * 100;

        if (this.remainingPercent <= percentChange) {
            percentChange = this.remainingPercent;
            finished = true;
        }

        this.moveCards(percentChange);

        moveElement(this.currentCard, percentChange);
        moveElement(this.nextCard, percentChange);

        if (!finished) {
            requestAnimationFrame(this.step.bind(this));
        }
    }

    getNextCard() {
        let nextCardId = (parseInt(this.currentCard.id) + this.direction).mod(this.cards.length);
        this.nextCard = this.cards[nextCardId];

        this.currentCard.style.display = "none";
        this.nextCard.style.display = "block";

        this.currentCard = this.nextCard;
    }

    switchCards(direction) {
        this.direction = direction;
        this.lastTimeStamp = -1;
        this.remainingPercent = 100;
        this.getNextCard();

        // window.requestAnimationFrame(this.step.bind(this));

    }

    setupButtons() {
        this.rightButton = document.getElementById("rightButton");
        this.rightButton.addEventListener('click', () => {
            this.switchCards(1)
        });
        this.leftButton = document.getElementById("leftButton");
        this.leftButton.addEventListener('click', () => {
            this.switchCards(-1)
        });
    }
}

function getNextCard(currentId) {
    let nextCard = document.getElementById(currentId + 1);
    if (!nextCard) {       // If there is no project card with id, currentId + 1
        nextCard = document.getElementById(0);
    }
    return nextCard;
}

document.addEventListener("DOMContentLoaded", () => {
    let banner = new Banner();
});