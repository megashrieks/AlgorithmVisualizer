import { GArray } from '../GArray';

class VArray extends GArray{
    get value() {
        return this.array;
    }
    set value(val) {
        let deref = [...val];
        let temp = [...val];
        this.array = temp;
        this.repr.add_to_queue(() => {
            this.label = deref;
        })
    }
    highlight = (row,col) => {
        if (this.dimensions == 1)
            this.repr.add_to_queue(() => this.highlight_indices.add({ row: 0, col: row }));
        else
            this.repr.add_to_queue(()=>this.highlight_indices.add({ row, col }));
    }

    remove_highlight = (row, col) => this.repr.add_to_queue(() => this.highlight_indices.delete({ row, col }));
    clear_highlight = () => this.repr.add_to_queue(() => this.highlight_indices.clear());

}
export { VArray };