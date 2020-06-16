class GNode{
    static __member_count = 0
    static geometry = {
        radius: 25,
        fill_color: "#333",
        text_color: "#fff",
        text_size: "20px",
    }
    id = null;
    repr = null;
    position = null;
    constructor(representation, position = {
        x: representation.canvas.width * Math.random(),
        y: representation.canvas.height * Math.random()
    }) {
        GNode.__member_count++;
        this.id = GNode.__member_count;
        this.repr = representation;
        this.position = position;
        this.repr.attach_to_draw("GNode", this);
    }
    draw() {
        this.repr.context.lineWidth = 5
        this.repr.circle(GNode.geometry.radius + 1, this.position).stroke("#ccc");
        this.repr.context.lineWidth = 5
        
        this.repr.circle(GNode.geometry.radius, this.position).fill(GNode.geometry.fill_color);
        this.repr.center_text(this.id, this.position, GNode.geometry.text_size)
            .fill(GNode.geometry.text_color);
    }
}

export {GNode}