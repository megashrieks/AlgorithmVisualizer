import { Edge } from './Edge';

class UDEdge extends Edge{
    static __member_count = 0;
    static class_identifier = "UDEdge";
    print_arrow = false;
    // constructor(...args) {
    //     super(...args);
    //     super.get_id = this.get_id; 
    //     super.get_id = this.get_id;
    //     super.add_edge_to_node = this.add_edge_to_node;
    //     super.get_id = this.get_id;
    // }
    get_id() {
        return UDEdge.class_identifier + UDEdge.__member_count++;
    }
    get_cid() {
        return UDEdge.class_identifier;
    }
    add_edge_to_node (){
        this.start.add_adjacent(this.weight, this.end, this.remove_edge_from_node,this, this.id);
        this.end.add_adjacent(this.weight, this.start, this.remove_edge_from_node,this, this.id);
    }
    remove_edge_from_node() {
        this.start.remove_adjacent(this.id);
        this.end.remove_adjacent(this.id);
    }
}

export { UDEdge };