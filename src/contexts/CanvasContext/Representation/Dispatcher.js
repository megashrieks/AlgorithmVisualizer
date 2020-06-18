import { GNode } from './GNode';
import { DEdge } from './DEdge';
import { UDEdge } from './UDEdge';

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
            if (!held.length) return;
            let selected = null;
            for (let i = held.length - 1; i >= 0;--i) {
                if (held[i] instanceof GNode) { selected = held[i]; break;}
            }
            if (!selected) return;
            if (!start) {
                start = selected
                start.highlight = true;
            }
            else {
                end = selected;
                end.highlight = true;
                new DEdge(this.repr, start, end);
                this.unregisterClickListener("DEdge");
            }
        });
    }
    createUnDirectedEdge = () => {
        let start = null, end = null;
        this.registerClickListener("UDEdge", held => {
            if (!held.length) return;
            let selected = null;
            for (let i = held.length - 1; i >= 0; --i) {
                if (held[i] instanceof GNode) { selected = held[i]; break; }
            }
            if (!selected) return;
            if (!start) {
                start = selected
                start.highlight = true;
            }
            else {
                end = selected;
                end.highlight = true;
                new UDEdge(this.repr, start, end);
                this.unregisterClickListener("UDEdge");
            }
        });
    }
    removeElement() {
        this.registerClickListener("REMOVE_ELEMENT", selected => {
            let element = selected[selected.length - 1];
            element.release();
            this.unregisterClickListener("REMOVE_ELEMENT");
        })
    }
}

export { Dispatcher };