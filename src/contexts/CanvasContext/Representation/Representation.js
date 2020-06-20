import { Drawing } from './Drawing';
import { GNode } from './GNode';
class Representation extends Drawing{
    draw_objects = {};
    drag_register = {};
    select_register = {};
    mouse_held = [];
    mouse_offset = [];
    selected = [];
    click_listeners = {};
    animation = {
        playing:false,
        execution_queue: [],
        execution_pointer: 0,
        delay: 500,
        interval_pointer: null
    };

    constructor(canvas, context) {
        super(canvas, context);
        canvas.onmousedown = this.handleMouseDown;
        canvas.onmouseup = this.handleMouseUp;
        canvas.onmousemove = this.handleMouseMove;
        canvas.onclick = this.handleClick;
    }
    add_to_queue = func => this.animation.execution_queue.push(func);
    clear_queue() {
        this.animation.execution_queue.length = 0;
        this.animation.execution_pointer = 0;
    }
    
    start_execution () {
        this.animation.playing = true;
        this.animation.interval_pointer = setInterval(() => {
            if (this.animation.execution_pointer >= this.animation.execution_queue.length) {
                clearInterval(this.animation.interval_pointer);
                this.animation.playing = false;
                return;
            }
            this.animation.execution_queue[this.animation.execution_pointer++]();
            this.draw();
        }, this.animation.delay);
    }
    stop_execution() {
        this.animation.playing = false;
        clearInterval(this.animation.interval_pointer);
    }
    push_if_exists(object, key, structure) {
        if (object[key])
            object[key].push(structure);
        else
            object[key] = [structure];
    }
    remove_if_exists(object, key, structure) {
        if (object[key]) {
            let i;
            for (i = 0; i < object[key].length;++i) {
                if (object[key][i].id === structure.id) break;
            }
            object[key].splice(i,1);
            if (!object[key].length) delete object[key];
        }
    }
    attach_to_draw = (key, structure) => this.push_if_exists(this.draw_objects, key, structure);
    registerSelection = (key, structure)  => this.push_if_exists(this.select_register, key, structure);
    registerDragging = (key, structure) => this.push_if_exists(this.drag_register, key, structure);
    
    detach_from_draw = (key, structure) => {this.remove_if_exists(this.draw_objects, key, structure);}
    unregisterSelection = (key, structure) => this.remove_if_exists(this.select_register, key, structure);
    unregisterDragging = (key, structure) => this.remove_if_exists(this.drag_register, key, structure);


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
            for (let j = this.drag_register[i].length - 1; j >= 0;--j) {
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
        this.selected.forEach(element => {
            element.unselect();
        })
        this.selected.length = 0;
        for (let i in this.select_register) {
            for (let j = this.select_register[i].length - 1; j >= 0; --j) {
                if (this.select_register[i][j].mouse_inside({
                    x: clientX,
                    y: clientY
                })) {
                    this.select_register[i][j].select();
                    this.selected.push(this.select_register[i][j]);
                    break;
                }
            }
        }
    }
    handleMouseUp = _ => {
        for (let i in this.mouse_held) {
            this.mouse_held[i].held = false;
        }
        for (let i in this.click_listeners) {
            this.click_listeners[i](this.selected);
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