import { GNode } from './GNode';
import { DEdge } from './DEdge';

class Dispatcher{
    repr = null;
    constructor(representation) {
        this.repr = representation;
    }
    registerClickListener = (key, func) => this.repr.registerClickListener(key,func);
    unregisterClickListener = key => this.repr.unregisterClickListener(key);

    createDirectedEdge = () => {
        let start = null, end = null;
        this.registerClickListener("DEdge", held => {
            if (!start) {
                if (!held[held.length - 1]) return;
                start = held[held.length - 1];
                start.highlight = true;
            }
            else {
                if (!held[held.length - 1]) return;
                end = held[held.length - 1];
                end.highlight = true;
                new DEdge(this.repr,start, end);
                this.unregisterClickListener("DEdge");
                setTimeout(() => {
                    start.highlight = false;
                    end.highlight = false;
                    this.repr.draw();
                }, 200);
            }
        });
    }
}

export { Dispatcher };