class GNode{
    static __member_count = 0
    static geometry = {
        radius: 25,
        fill_color: "#333",
        highlight_color: "rgb(56,56,250)",
        text_color: "#fff",
        text_size: "20px",
        line_width:20,
    }
    id = null;
    repr = null;
    position = null;
    held = false;
    highlight_node = false;
    class_identifier = "GNode";
    value = null;

    effective_radius = GNode.geometry.radius + GNode.geometry.line_width;
    adjacent_elements = [];
    adjacent_elements_map = {};
    dependants = [];
    constructor(representation, position = {
        x: representation.canvas.width * Math.random(),
        y: representation.canvas.height * Math.random()
    }) {
        GNode.__member_count++;
        this.id = GNode.__member_count;
        this.value = this.id;
        this.repr = representation;
        this.position = position;
        this.repr.attach_to_draw(this.class_identifier, this);
        this.repr.registerDragging(this.class_identifier, this);
        this.repr.registerSelection(this.class_identifier, this);
    }

    interface() {
        return;
    }

    release() {
        this.repr.detach_from_draw(this.class_identifier, this);
        this.repr.unregisterDragging(this.class_identifier, this);
        this.repr.unregisterSelection(this.class_identifier, this);

        for (let i in this.adjacent_elements) {
            if (!this.adjacent_elements[i]) continue;
            this.adjacent_elements[i].cleanup();
        }
        for (let i in this.dependants) {
            if (!this.dependants[i]) continue;
            this.dependants[i].release();
        }
        delete this.adjacent_elements;
        delete this.adjacent_elements_map;
        delete this.dependants;
        delete this;
    }
    add_adjacent(weight, element,cleanup, object, id) {
        this.adjacent_elements.push({
            weight,
            element,
            cleanup,
            edge:object
        });
        this.adjacent_elements_map[id] = this.adjacent_elements.length - 1;
    }
    add_dependant = element => this.dependants.push(element);
    remove_dependant = element => {
        let i;
        for (i in this.dependants) {
            if (this.dependants[i] === element) break;
        }
        this.dependants[i] = null;
    }
    remove_adjacent(id) {
        let index = this.adjacent_elements_map[id];
        if (index === undefined) return;
        this.adjacent_elements[index] = null;
        delete this.adjacent_elements_map[id];
    }
    mouse_inside({ x, y }) {
        return (this.position.x - x) ** 2 + (this.position.y - y) ** 2 < GNode.geometry.radius ** 2
    }
    select = () => this.highlight_node = true;
    unselect = () => this.highlight_node = false;
    draw() {
        let strokecolor = "#fff";
        let fill = GNode.geometry.fill_color;
        if (this.held) strokecolor = "rgb(250,250,56)";
        if (this.highlight_node) fill = GNode.geometry.highlight_color;


        this.repr.context.lineWidth = GNode.geometry.line_width;
        this.repr.circle(GNode.geometry.radius + 1, this.position).stroke(strokecolor);
        this.repr.context.lineWidth = 1
        
        this.repr.circle(GNode.geometry.radius, this.position).fill(fill);
        this.repr.center_text(this.value, this.position, GNode.geometry.text_size)
            .fill(GNode.geometry.text_color);
    }
}

export {GNode}