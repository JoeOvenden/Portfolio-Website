
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
        this.animationTime = 1000;      // Animation time in ms
        this.currentShift = 0;          // Curent amount of left/right in percent
        this.start = -1;
        this.projectCardsDiv = document.getElementById("project-cards");
        this.isAnimating = false;
    }

    moveElement(e, percentageChange) {
        let currentRight = parseInt(e.style.right) || 0;
        e.style.right = (currentRight + percentageChange) + '%';
    }



    setShift() {
        let shiftAmount = this.currentShift * this.direction;

        // A card coming from the left (direction = -1) means that the card is before the current card, meaning by default when made visible it would kick
        // the current card out of the way. Both cards need to be shifted 
        if (this.direction == -1) {
            shiftAmount += 100;
        }
        this.currentCard.style.right = shiftAmount + '%';
        this.nextCard.style.right = shiftAmount + '%';
    }

    sideOfNextCard() {
        let compare = this.currentCard.compareDocumentPosition(this.nextCard);
        if (compare == 4) {
            return "RIGHT";
        }
        else if (compare == 2) {
            return "LEFT";
        }
        return "ERROR";
    }

    swapIfNeeded() {
        let nextCardSide = this.sideOfNextCard();
        // If next card is meant to be coming from the right but it is on the left, then swap
        if (this.direction == 1 && nextCardSide == "LEFT") {
            this.projectCardsDiv.insertBefore(this.currentCard, this.nextCard);
        }
        // If next card is meant to be coming from the left but it is on the right, then swap
        else if (this.direction == -1 && nextCardSide == "RIGHT") {
            this.projectCardsDiv.insertBefore(this.nextCard, this.currentCard);
        }
    }

    finishAnimation() {
        this.start = -1;
        this.isAnimating = false;
        this.nextCard.style.right = "";
        this.currentCard.style.right = "";

        this.currentCard.style.display = "none";
        this.currentCard = this.nextCard;
    }

    slideBanner(timeStamp) {
        if (this.start == -1) {
            this.start = timeStamp;
        }

        let timeElapsed = timeStamp - this.start;
        if (timeElapsed >= this.animationTime) {
            this.finishAnimation();
            return;
        }

        let t = timeElapsed / this.animationTime;

        // this.currentShift = (-Math.cos(Math.PI * timeElapsed * (1 / this.animationTime)) + 1) * 50      // Sinusoidal function 
        // this.currentShift = t * 100                                                                     // Linear
        // this.currentShift = ((5 + Math.log(t + 0.0067)) / 5) * 100;                                     // Logarithmic 1
        // this.currentShift = ((Math.log(t) + 6.5) / 6.5) * 100;                                          // Logarithmic 2
        // this.currentShift = Math.pow(t, 0.2) * 100;                                                     // Root t
        this.currentShift = ( (-1 * (t ** 2)) + (2 * t)) * 100;                                            // Quadratic

        console.log(this.currentShift);

        this.setShift();
        this.swapIfNeeded();
        requestAnimationFrame(this.slideBanner.bind(this));
    }

    switchCards(direction) {
        this.direction = direction;

        if (this.isAnimating) {
            return;
        }

        let nextCardId = (parseInt(this.currentCard.id) + this.direction).mod(this.cards.length);
        this.nextCard = document.getElementById(nextCardId);

        this.nextCard.style.display = "block";

        this.isAnimating = true;
        requestAnimationFrame(this.slideBanner.bind(this))
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

document.addEventListener("DOMContentLoaded", () => {
    let banner = new Banner();
});