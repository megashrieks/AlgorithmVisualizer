import { DEdge } from './DEdge';

class UDEdge extends DEdge{
    static __member_count = 0;
    static class_identifier = "UDEdge";
    print_arrow = false;
    get_id() {
        return UDEdge.class_identifier + UDEdge.__member_count++;
    }
    get_cid() {
        return UDEdge.class_identifier;
    }
    add_edge_to_node=()=> {
        this.start.add_adjacent(this.weight, this.end, this.id, this.remove_edge_from_node);
        this.end.add_adjacent(this.weight, this.start, this.id, this.remove_edge_from_node);
    }
    remove_edge_from_node=()=> {
        this.start.remove_adjacent(this.id);
        this.end.remove_adjacent(this.id);
    }
}

export { UDEdge };