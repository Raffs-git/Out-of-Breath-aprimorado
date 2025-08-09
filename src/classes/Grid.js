
import Invader from "./Invader.js";

class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.direction = "rigth";
        this.moveDown = false;

        this.invadersVelocity = 0.7;

        this.invaders = this.init(rows, cols);
    }

    init(rows = this.rows, cols = this.cols) {
        this.rows = rows;
        this.cols = cols;
        const array = [];

        const invaderWidth = 30;
        const invaderHeight = 25;
        const invaderPadding = 15;


        const gridWidth = cols * (invaderWidth + invaderPadding) - invaderPadding;

        const startX = (innerWidth - gridWidth) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const invader = new Invader(
                    {
                        x: startX + col * (invaderWidth + invaderPadding),
                        y: row * (invaderHeight + invaderPadding) + 50,
                    },
                    this.invadersVelocity
                );
                array.push(invader);
            }
        }
        return array;
    }

    draw(ctx) {
        this.invaders.forEach((invader) => invader.draw(ctx));
    }
    update() {
        if (this.reachedRightBoundary()) {
            this.direction = "left";
            this.moveDown = true;
        } else if (this.reachedLeftBoundary()) {
            this.direction = "rigth";
            this.moveDown = true;
        }

        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                invader.moveDown();
                invader.incrementVelocity(0.1)
                this.invadersVelocity = invader.velocity;
            }

            if (this.direction === "rigth") invader.moveRight();
            if (this.direction === "left") invader.moveLeft();


        });

        this.moveDown = false;

    }

    reachedRightBoundary() {

        return this.invaders.some(
            (invader) => invader.position.x + invader.width >= innerWidth

        );

    }

    reachedLeftBoundary() {
        return this.invaders.some(
            (invader) => invader.position.x <= 0);
    }
    getRandomIvader() {
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }
}

export default Grid;