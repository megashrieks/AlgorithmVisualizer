import { Edge } from './Edge';
class DEdge extends Edge{
    static __member_count = 0;
    static class_identifier = "DEdge";
    get_id() { return DEdge.class_identifier + DEdge.__member_count++; }
    get_cid() { return DEdge.class_identifier; }
    add_edge_to_node (){
        this.start.add_adjacent(this.weight, this.end, this.release,this, this.id);
        this.end.add_dependant(this);
    }
    remove_edge_from_node () {
        this.start.remove_adjacent(this.id);
        this.end.remove_dependant(this);
    }
}

export { DEdge };