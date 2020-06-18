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
    highlight = false;
    effective_radius = GNode.geometry.radius + GNode.geometry.line_width;
    constructor(representation, position = {
        x: representation.canvas.width * Math.random(),
        y: representation.canvas.height * Math.random()
    }) {
        GNode.__member_count++;
        this.id = GNode.__member_count;
        this.repr = representation;
        this.position = position;
        this.repr.attach_to_draw("GNode", this);
        this.repr.registerDragging("GNode", this);
        this.repr.registerSelection("GNode", this);
    }
    mouse_inside({ x, y }) {
        return (this.position.x - x) ** 2 + (this.position.y - y) ** 2 < GNode.geometry.radius ** 2
    }
    select() { this.highlight = true; }
    unselect() { this.highlight = false;}
    draw() {
        let strokecolor = "#fff";
        let fill = GNode.geometry.fill_color;
        if (this.held) strokecolor = "rgb(250,250,56)";
        if (this.highlight) fill = GNode.geometry.highlight_color;


        this.repr.context.lineWidth = GNode.geometry.line_width;
        this.repr.circle(GNode.geometry.radius + 1, this.position).stroke(strokecolor);
        this.repr.context.lineWidth = 1
        
        this.repr.circle(GNode.geometry.radius, this.position).fill(fill);
        this.repr.center_text(this.id, this.position, GNode.geometry.text_size)
            .fill(GNode.geometry.text_color);
    }
}

export {GNode}