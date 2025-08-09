
class Obstacle {
    constructor(x, y, width, height) {
        this.position = {
            x: x,
            y: y
        };
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    hit(projectile) {
        
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }
}

export default Obstacle;