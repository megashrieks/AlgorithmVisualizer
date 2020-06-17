class UDEdge {
    repr = null;
    start = null;
    end = null;
    constructor(representation, start, end) {
        this.repr = representation;
        this.start = start;
        this.end = end;
        this.repr.attach_to_draw("UDEdge", this);
    }

    get_border_position(start, end, radius) {
        let angle = Math.atan2(end.y - start.y, start.x - end.x) - Math.PI / 2;
        return {
            x: start.x + Math.sin(angle) * radius,
            y: start.y + Math.cos(angle) * radius
        };
    }
    draw() {
        if (!this.start || !this.end) return false;
        let border_start = this.get_border_position(
            this.start.position,
            this.end.position,
            this.start.effective_radius
        );
        let border_end = this.get_border_position(
            this.end.position,
            this.start.position,
            this.end.effective_radius
        );

        this.repr.context.lineWidth = 3;
        let temp = this.repr.context.lineCap;
        this.repr.context.lineCap = "round";
        this.repr.draw_line(border_start, border_end);
        this.repr.context.lineWidth = 1;
        this.repr.context.lineCap = temp;
    }

}

export { UDEdge };