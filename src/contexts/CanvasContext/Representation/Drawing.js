class Drawing{
    canvas = null;
    context = null;
    fillColor = "#000000";
    strokeColor = "#000000";
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }
    doOp(func) {
        this.context.beginPath();
        func();
        this.context.closePath();
    }
    circle(radius, position) {
        const run = () => this.context.arc(position.x, position.y, radius, 0, Math.PI * 2);

        return {
            fill: (color = this.fillColor) => {
                this.doOp(run);
                let temp = this.fillColor;
                this.context.fillStyle = color;
                this.context.fill();
                this.context.fillStyle = temp;
            },
            stroke: (color = this.strokeColor) => {
                this.doOp(run);
                let temp = this.strokeColor;
                this.context.strokeStyle = color;
                this.context.stroke();
                this.context.strokeStyle = temp;
            }
        }
    }
}
export { Drawing };