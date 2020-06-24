import { GArray } from '../GArray';

class VArray extends GArray{
    get value() {
        return this.array;
    }
    set value(val) {
        let deref = JSON.parse(JSON.stringify(val));
        let temp = JSON.parse(JSON.stringify(val));
        this.array = temp;
        this.repr.add_to_queue(() => {
            this.label = deref;
        })
    }
    highlight = (row,col) => {
        if (this.dimensions == 1)
            this.repr.add_to_queue(() => this.highlight_indices.add(JSON.stringify({ row: 0, col: row })));
        else
            this.repr.add_to_queue(() => this.highlight_indices.add(JSON.stringify({ row, col })));
    }

    remove_highlight = (row, col) => {
        this.repr.add_to_queue(() => this.highlight_indices.delete(JSON.stringify({ row, col })));
    }
    clear_highlight = () => this.repr.add_to_queue(() => this.highlight_indices.clear());

}
export { VArray };