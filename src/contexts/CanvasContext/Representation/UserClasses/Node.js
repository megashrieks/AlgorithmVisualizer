import { GNode } from '../../Representation/GNode';
class Node extends GNode{
    get adjacent() {
        return this.adjacent_elements.filter(item => item != null).map(({element}) => element);
    }
    get edges() {
        return this.adjacent_elements.filter(item => item != null).map(({ edge }) => edge);
    }
    highlight = (value=true) => {
        if (value)
            this.repr.add_to_queue(() => this.select());
        else
            this.repr.add_to_queue(() => this.unselect());
    }
}
export{Node}