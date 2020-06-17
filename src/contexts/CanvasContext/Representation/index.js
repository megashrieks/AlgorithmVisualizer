import { Drawing } from './Drawing';
import { GNode } from './GNode';
class Representation extends Drawing{
    draw_objects = {};
    drag_register = {};
    mouse_held = [];
    mouse_offset = [];
    click_listeners = {};
    constructor(canvas, context) {
        super(canvas, context);
        canvas.onmousedown = this.handleMouseDown;
        canvas.onmouseup = this.handleMouseUp;
        canvas.onmousemove = this.handleMouseMove;
        canvas.onclick = this.handleClick;
    }


    attach_to_draw = (key, structure) => {
        if (this.draw_objects[key])
            this.draw_objects[key].push(structure);
        else
            this.draw_objects[key] = [structure];
    }



    registerDragging = (key, structure) => {
        if (this.drag_register[key])
            this.drag_register[key].push(structure);
        else
            this.drag_register[key] = [structure];
    }
    registerClickListener = (key, func) => {
        if (this.click_listeners[key]) return false;
        this.click_listeners[key] = func;
        return true;
    }
    unregisterClickListener = key => {
        if (!this.click_listeners[key]) return false;
        delete this.click_listeners[key];
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
                    this.mouse_offset.push({
                        x: this.drag_register[i][j].position.x - clientX,
                        y: this.drag_register[i][j].position.y - clientY
                    });
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
        for (let i in this.click_listeners) {
            this.click_listeners[i](this.mouse_held);
        }
        this.mouse_held.length = 0;
        this.mouse_offset.length = 0;
        this.draw();
    }

    handleMouseMove = event => {
        if (!this.mouse_held.length) return;
        let { clientX, clientY } = event;
        clientX -= event.target.offsetLeft;
        clientY -= event.target.offsetTop;
        for (let i in this.mouse_held) {
            this.mouse_held[i].position = {
                x: clientX+this.mouse_offset[i].x,
                y: clientY+this.mouse_offset[i].y
            };
        }
        this.draw();
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