class DEdge{
    repr = null;
    start = null;
    end = null;
    constructor(representation, start, end) {
        this.repr = representation;
        this.start = start;
        this.end = end;
        this.repr.attach_to_draw("DEdge", this);
    }

    get_border_position(start, end, radius) {
        let angle = Math.atan2(end.y - start.y, start.x - end.x)-Math.PI/2;
        return {
            x: start.x + Math.sin(angle) * radius,
            y: start.y + Math.cos(angle) * radius
        };
    }

    get_arrow_vertices(start, end) {
        let angle = Math.atan2(end.y - start.y, start.x - end.x) - Math.PI / 2;
        let offset_angle = Math.PI/4;
        const length = 10;
        let first_angle = angle - offset_angle * 3;
        let second_angle = angle + offset_angle * 3;
        return [
            {
                x: end.x + Math.sin(first_angle) * length,
                y: end.y + Math.cos(first_angle) * length,
            },

            {
                x: end.x + Math.sin(second_angle) * length,
                y: end.y + Math.cos(second_angle) * length,
            }
        ]
    }

    draw() {

        //TODO: detect the return false from the representation draw loop and handle it
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
        let [arrow1,arrow2] = this.get_arrow_vertices(border_start, border_end);
        this.repr.draw_line(border_end, arrow1);
        this.repr.draw_line(border_end, arrow2);


        this.repr.context.lineWidth = 1;
        this.repr.context.lineCap = temp;
    }

}

export { DEdge };