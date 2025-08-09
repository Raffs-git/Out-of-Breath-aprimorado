
import Grid from "./classes/Grid.js";
import Invader from "./classes/Invader.js";
import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";
import Obstacle from "./classes/Obstacle.js";
import BlackHole from "./classes/BlackHole.js";
import Asteroid from "./classes/Asteroid.js";


const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");


startScreen.classList.add("show");


const canvas = document.querySelector ("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

const GameState = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};
let currentState = GameState.START;


const gameData = {
    score: 0,
    level: 1,
    high: 0,
} 


const showGameData = () => {
    scoreElement.textContent = gameData.score
    levelElement.textContent = gameData.level
    highElement.textContent = gameData.high
}

const player = new Player(canvas.width, canvas.height);
let level = 1;
const grid = new Grid (3, 6);

const obstacles = [
    new Obstacle(canvas.width / 5, canvas.height - 200, 80, 20),
    new Obstacle((canvas.width / 5) * 2, canvas.height - 200, 80, 20),
    new Obstacle((canvas.width / 5) * 3, canvas.height - 200, 80, 20),
    new Obstacle((canvas.width / 5) * 4, canvas.height - 200, 80, 20),
];

const incrementScore = (value) => {
    gameData.score +=value
    if ( gameData.score>gameData.high ) {
    gameData.high = gameData.score
    }
}

const playerProjectiles = [];
const invadersProjectiles = [];
const playerBlackHoles = [];
const asteroids = [];
let asteroidTimer = 0;
const asteroidInterval = 5000;


let invaderShootTimer = 0;
const invaderShootInterval = 1000;

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    },
};

const drawProjectiles = () => {
    const projectiles = [...playerProjectiles,...invadersProjectiles]

    projectiles.forEach((Projectile) => {
        Projectile.draw(ctx);
        Projectile.update();
});
    
};


const clearProjectiles = () => {
    playerProjectiles.forEach((Projectile, index) => {
    if (Projectile.position.y <= 0) {
        playerProjectiles.splice (index, 1);
        }
    });
};


const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
    playerProjectiles.some((projectile, projectileIndex) => {
        if (invader.hit(projectile)) {
       
            if (projectile.isBlackHole) {
                playerBlackHoles.push(new BlackHole(
                    invader.position.x + invader.width/2,
                    invader.position.y + invader.height/2,
                    50,
                    2000
                ));
            }

            incrementScore(10);
            grid.invaders.splice(invaderIndex, 1);
            playerProjectiles.splice(projectileIndex, 1);
        }
    });
});
};


const checkObstacleHit = () => {
    obstacles.forEach((obstacle, obstacleIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (obstacle.hit(projectile)) {
                playerProjectiles.splice(projectileIndex, 1);
                return true;
            }
        });
        invadersProjectiles.some((projectile, projectileIndex) => {
            if (obstacle.hit(projectile)) {
                invadersProjectiles.splice(projectileIndex, 1);
                return true;
            }
        });
    });
};

const checkPlayerHitByAsteroid = () => { 
    asteroids.some((asteroid, index) => {
        if (asteroid.hitPlayer(player)) {
            console.log('Jogador atingido por um asteroide!');
            player.visible = false;
            currentState = GameState.GAME_OVER;
            return true;
        }
    });
};


const checkPlayerHit = () => {
    invadersProjectiles.some((projectile, index) => {
    if (player.hit(projectile)) {
        console.log('Player atingido!');
        invadersProjectiles.splice(index, 1);
        player.visible = false; 
        currentState = GameState.GAME_OVER;
        return true; 
    }
    });
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameState.START) {
        startScreen.classList.add("show");
    } else if (currentState === GameState.PLAYING) {
        startScreen.classList.remove("show");
        gameOverScreen.classList.remove("show");
    
        
        if (playerBlackHoles.length > 0) {
            playerBlackHoles.forEach((blackHole, bhIndex) => {
                blackHole.draw(ctx);
                blackHole.update();
                if (!blackHole.active) {
                    playerBlackHoles.splice(bhIndex, 1);
                    return;
                }
              
                grid.invaders.forEach((invader, invaderIndex) => {
                    const distance = Math.hypot(invader.position.x - blackHole.position.x, invader.position.y - blackHole.position.y);
                    if (distance < blackHole.radius) {
                        grid.invaders.splice(invaderIndex, 1);
                    }
                });
                invadersProjectiles.forEach((projectile, pIndex) => {
                    const distance = Math.hypot(projectile.position.x - blackHole.position.x, projectile.position.y - blackHole.position.y);
                    if (distance < blackHole.radius) {
                        invadersProjectiles.splice(pIndex, 1);
                    }
                });
            });
        }
    
        showGameData ()
        
        drawProjectiles();
        clearProjectiles();

         asteroidTimer += 1000 / 60;
        if (asteroidTimer >= asteroidInterval) {
            const x = Math.random() * (canvas.width - 50) + 25;
            const asteroid = new Asteroid(x, 0, 20, { x: 0, y: 2 });
            asteroids.push(asteroid);
            asteroidTimer = 0;
        }
        
        asteroids.forEach((asteroid, index) => {
            asteroid.draw(ctx);
            asteroid.update();
            if (asteroid.position.y > canvas.height + 50) {
                asteroids.splice(index, 1);
                return;
            }
        });

        checkPlayerHit();
        checkObstacleHit();
        checkShootInvaders();
        checkPlayerHitByAsteroid();
        
        invaderShootTimer += 1000 / 60;
        if (invaderShootTimer >= invaderShootInterval) {
            const invader = grid.getRandomIvader();
            if (invader) {
                invader.shoot(invadersProjectiles);
            }
            invaderShootTimer = 0;
        }
        
        if (grid.invaders.length === 0) {
            level++;
            grid.invaders = grid.init(level + 2, level + 2);

            gameData.level +=1
        }
        
        grid.draw(ctx);
        grid.update();

        obstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });

        ctx.save();
        ctx.translate(player.position.x + player.width/2, player.position.y + player.height/2);

        if (keys.shoot.pressed && keys.shoot.released && player.visible) {
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }

        if (keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);
        }

        if (keys.right && player.position.x <= canvas.width - player.width) {
            player.moveRight();
            ctx.rotate(0.15);
        }

        player.draw(ctx);

        ctx.translate(-player.position.x - player.width/2, -player.position.y - player.height/2);
        ctx.restore();
        
    } else if (currentState === GameState.GAME_OVER) {
        drawProjectiles();
        grid.draw(ctx);
        obstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
        player.draw(ctx);
        asteroids.forEach(asteroid => asteroid.draw(ctx));

        gameOverScreen.classList.add("show");
    }

    requestAnimationFrame(gameLoop);
};

const restartGame = () => {
    gameOverScreen.classList.remove("show");
    
    currentState = GameState.PLAYING;
    player.visible = true;
    player.position.x = canvas.width / 2 - player.width / 2;
    player.position.y = canvas.height - player.height - 30;
    
    level = 1;
    grid.invaders = grid.init(3, 6);
    
    invadersProjectiles.length = 0;
    playerBlackHoles.length = 0;
    asteroids.length = 0;
    
    gameData.score = 0;
    gameData.level = 1;
};

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    
    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;

  
    if (key === "c") {
        const p = new Projectile({
            x: player.position.x + player.width/2,
            y: player.position.y,
        }, -5);
        p.isBlackHole = true;
        playerProjectiles.push(p);
    }

    if (key === "enter" && currentState === GameState.PLAYING) {
        keys.shoot.pressed = true;
    }
    
    if (key === "enter" && currentState === GameState.GAME_OVER) {
        restartGame();
    }
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    
    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;

    if (key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

buttonPlay.addEventListener("click", () => {
    startScreen.classList.remove("show");
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;
});

buttonRestart.addEventListener("click", restartGame);

gameLoop();