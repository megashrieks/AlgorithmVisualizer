import { Drawing } from './Drawing';
import { GNode } from './GNode';
class Representation extends Drawing{
    draw_objects = {};
    drag_register = {};
    mouse_held = [];
    constructor(canvas, context) {
        super(canvas, context);
        canvas.onmousedown = this.handleMouseDown;
        canvas.onmouseup = this.handleMouseUp;
        canvas.onmousemove = this.handlemousemove;
    }

    registerDragging = (key, structure) => {
        if (this.drag_register[key])
            this.drag_register[key].push(structure);
        else
            this.drag_register[key] = [structure];
    }

    handleMouseDown = event => {
        let { clientX, clientY } = event;
        clientX -= event.target.offsetLeft;
        clientY -= event.target.offsetTop;
        let flag = false;
        for (let i in this.drag_register) {
            for (let j in this.drag_register[i]) {
                if (this.drag_register[i][j].mouse_inside({
                    x: clientX,
                    y: clientY
                })) {
                    this.drag_register[i][j].held = true;
                    this.mouse_held.push(this.drag_register[i][j]);
                    flag = true;
                    break;
                }
            }
            if (flag) break;
        }
    }
    handleMouseUp = _ => {
        for (let i in this.mouse_held) {
            this.mouse_held[i].held = false;
        }
        this.mouse_held.length = 0;
        this.draw();
    }

    handlemousemove = event => {
        if (!this.mouse_held.length) return;
        let { clientX, clientY } = event;
        clientX -= event.target.offsetLeft;
        clientY -= event.target.offsetTop;
        for (let i in this.mouse_held) {
            this.mouse_held[i].position = {
                x: clientX,
                y: clientY
            };
        }
        this.draw();
    }

    attach_to_draw = (key, structure) =>  {
        if (this.draw_objects[key])
            this.draw_objects[key].push(structure);
        else
            this.draw_objects[key] = [structure];
    }
    draw = () => {
        this.clear();
        for (let i in this.draw_objects) {
            for (let j in this.draw_objects[i]) {
                this.draw_objects[i][j].draw();
            }
        } 

    }
}
export { Representation, GNode };