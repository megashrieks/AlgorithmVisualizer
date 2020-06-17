class Drawing{
    canvas = null;
    context = null;
    fillColor = "#000000";
    strokeColor = "#000000";
    fontSize = "15px"
    fontFamily = "arial"
    font = this.fontSize+" "+this.fontFamily
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }
    doOp(func) {
        this.context.beginPath();
        func();
        this.context.closePath();
    }
    draw_line = (start, end) => {
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
    }
    pFill(color) {
        let temp = this.fillColor;
        this.context.fillStyle = color;
        this.context.fill();
        this.context.fillStyle = temp;
    }
    pStroke(color) {
        let temp = this.strokeColor;
        this.context.strokeStyle = color;
        this.context.stroke();
        this.context.strokeStyle = temp;
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    circle(radius, position) {
        const run = () => this.context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        return {
            fill: (color = this.fillColor) => {
                this.doOp(run);
                this.pFill(color);
            },
            stroke: (color = this.strokeColor) => {
                this.doOp(run);
                this.pStroke(color);
            }
        }
    }
    measure_text(string,font=this.font) {
        this.context.font = font;
        return {
            width: this.context.measureText(string).width,
            //find out approximate height of text
            //it is weird but it works
            height: this.context.measureText("M").width*0.81
        };
    }
    write_text(string, position) {
        return {
            fill: (color = this.fillColor) => {
                let temp = this.fillColor;
                this.context.fillStyle = color;
                this.context.fillText(string, position.x, position.y);
                this.context.fillStyle = temp;
            },
            stroke: (color = this.strokeColor) => {
                let temp = this.strokeColor;
                this.context.strokeStyle = color;
                this.context.strokeText(string, position.x, position.y);
                this.context.strokeStyle = temp;
            }
        }
    }
    center_text(string, position, fontSize) {
        let m;
        if(fontSize)
            m = this.measure_text(string,fontSize+" "+this.fontFamily);
        else
            m = this.measure_text(string)
        return this.write_text(string, {
            x: position.x - m.width / 2,
            y: position.y + m.height / 2
        });
    }
}
export { Drawing };