
export default class Asteroid {
    constructor(x, y, radius, velocity) {
        this.position = { x, y };
        this.radius = radius;
        this.velocity = velocity;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'blue'; 
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.position.y += this.velocity.y;
    }

    hit(projectile) {
        const distance = Math.hypot(
            this.position.x - projectile.position.x,
            this.position.y - projectile.position.y
        );

        return distance - this.radius - projectile.radius < 1;
    }

    hitPlayer(player) {
        const distance = Math.hypot(
            this.position.x - (player.position.x + player.width / 2),
            this.position.y - (player.position.y + player.height / 2)
        );

        return distance - this.radius - (player.width / 2) < 1;
    }
}