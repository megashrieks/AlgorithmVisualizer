import { Drawing } from './Drawing';
import { GNode } from './GNode';
class Representation extends Drawing{
    draw_objects = {};
    attach_to_draw(key, structure) {
        if (this.draw_objects[key])
            this.draw_objects[key].push(structure);
        else
            this.draw_objects[key] = [structure];
    }
    draw() {
        this.clear();
        for (let i in this.draw_objects) {
            for (let j in this.draw_objects[i]) {
                this.draw_objects[i][j].draw();
            }
        } 

    }
}
export { Representation, GNode };