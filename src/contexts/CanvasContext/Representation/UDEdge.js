class UDEdge {
    repr = null;
    start = null;
    end = null;
    weight = "";
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
    print_weight(start, end) {
        const dist = 20;
        let offset_angle = Math.PI / 2;
        if (end.x < start.x) offset_angle *= -1;
        let angle = this.repr.get_angle(start, end) - offset_angle;
        // console.log("slope", (start.y-end.y)/(start.x-end.x))
        let center = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2
        };
        let measure = this.repr.measure_text(this.weight);

        let position = {
            x: center.x + Math.cos(angle) * (dist + measure.width / 2),
            y: center.y + Math.sin(angle) * (dist + measure.height / 2),
        };
        this.repr.center_text(this.weight, position).fill();
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
        this.print_weight(border_start, border_end);

        this.repr.context.lineWidth = 3;
        let temp = this.repr.context.lineCap;
        this.repr.context.lineCap = "round";
        this.repr.draw_line(border_start, border_end);
        this.repr.context.lineWidth = 1;
        this.repr.context.lineCap = temp;
    }

}

export { UDEdge };