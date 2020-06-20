import { GNode } from './GNode';
import { DEdge } from './DEdge';
import { UDEdge } from './UDEdge';

class Dispatcher{
    repr = null;
    setState = null;
    constructor(representation,setState) {
        this.repr = representation;
        this.setState = setState;
        this.editListener();
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
                start.select();
            }
            else {
                end = selected;
                end.select()
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
                start.select();
            }
            else {
                end = selected;
                end.select();
                new UDEdge(this.repr, start, end);
                this.unregisterClickListener("UDEdge");
            }
        });
    }
    removeElement() {
        this.registerClickListener("REMOVE_ELEMENT", selected => {
            if (!selected.length) return;
            let element = selected[selected.length - 1];
            element.release();
            this.unregisterClickListener("REMOVE_ELEMENT");
        })
    }
    editListener() {
        this.registerClickListener("EDIT_ELEMENT", selected => {
            if (!selected.length) {
                this.setState(state => ({
                    ...state,
                    edge_selected: false,
                    node_selected: false,
                    change_value: null,
                    element_value:""
                }));
                return;
            }
            let element = selected[selected.length - 1];
            if (element instanceof GNode)
                this.setState(state => ({
                    ...state,
                    edge_selected: false,
                    node_selected: true,
                    element_value:element.value,
                    change_value: value => {
                        element.value = value;
                        this.repr.draw();
                    }
                }));
            else
                this.setState(state => ({
                    ...state,
                    edge_selected: true,
                    node_selected: false,
                    element_value:element.weight,
                    change_value: value => {
                        element.weight = value;
                        this.repr.draw();
                    }
                }));
        })
    }
    input = (type, quantity) => {
        return new Promise((resolve, _) => {
            let result = [];
            this.registerClickListener("INPUT", selected => {
                if (!selected.length) return;
                for (let index = selected.length; index >= 0; --index) {
                    if (selected[index] instanceof type) {
                        result.push(selected[index]);
                        if (result.length == quantity) {
                            this.unregisterClickListener("INPUT");
                            resolve(result);
                        }
                        return;
                    }
                }
            })
        })
    }
}

export { Dispatcher };