
export default class BlackHole {
    constructor(x, y, radius, duration) {
        this.position = { x, y };
        this.radius = radius;
        this.duration = duration;
        this.startTime = Date.now();
        this.active = true;
    }

    draw(ctx) {
        if (!this.active) return;
        const elapsedTime = Date.now() - this.startTime;
        const opacity = 1 - (elapsedTime / this.duration);
        
        ctx.save();
        ctx.beginPath();
       
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.shadowColor = `rgba(150, 0, 255, ${opacity})`;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (Date.now() - this.startTime > this.duration) {
            this.active = false;
        }
    }
}