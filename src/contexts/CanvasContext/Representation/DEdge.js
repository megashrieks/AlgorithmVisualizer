class DEdge{
    static __member_count = 0;
    static class_identifier = "DEdge";
    id = null;
    print_arrow = true;
    repr = null;
    start = null;
    end = null;
    weight = "50";
    lineWidth = 3;
    get_id() { return DEdge.class_identifier + DEdge.__member_count++; }
    get_cid() { return DEdge.class_identifier; }
    constructor(representation, start, end) {
        this.id = this.get_id();
        this.repr = representation;
        this.start = start;
        this.end = end;
        this.repr.attach_to_draw(this.get_cid(), this);
        this.repr.registerSelection(this.get_cid(), this);
        this.add_edge_to_node();
    }
    add_edge_to_node = ()=> {
        this.start.add_adjacent(this.weight, this.end, this.release, this.id);
        this.end.add_dependant(this);
    }
    remove_edge_from_node = () => {
        this.start.remove_adjacent(this.id);
        this.end.remove_dependant(this);
    }
    release = () => {
        this.remove_edge_from_node();
        this.repr.detach_from_draw(this.get_cid(), this);
        this.repr.unregisterSelection(this.get_cid(), this);
        delete this;
    }

    mouse_inside({ x, y }) {
        const dist_allowed = 50;
        let start = this.get_border_position(
            this.start.position,
            this.end.position,
            this.start.effective_radius - this.lineWidth
        ),
            end = this.get_border_position(
                this.end.position,
                this.start.position,
                this.end.effective_radius - this.lineWidth
            );
        //check if x,y are in the bounding box first to avoid extra computation
        let minx = Math.min(start.x, end.x),
            maxx = Math.max(start.x, end.x),
            miny = Math.min(start.y, end.y),
            maxy = Math.max(start.y, end.y);
        if (maxx - minx < dist_allowed) {
            let temp = dist_allowed - (maxx - minx) / 2;
            maxx += temp;
            minx -= temp;
        }
        if (maxy - miny < dist_allowed) {
            let temp = dist_allowed - (maxy - miny) / 2;
            maxy += temp;
            miny -= temp;
        }
        if (x < minx || x > maxx || y < miny || y > maxy) return false;

        //get ax+by+c=0 form from start and end point
        let slope = (end.y - start.y) / (end.x - start.x);
        let A = -slope,
            B = 1,
            C = -(-start.x * slope + start.y);
        let d = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
        return d < dist_allowed;
    }
    select() {
        this.draw_color = "#f00";
    }
    unselect() {
        this.draw_color = "#000";
    }
    get_border_position(start, end, radius) {
        let angle = this.repr.get_angle(start,end);
        return {
            x: start.x + Math.cos(angle) * radius,
            y: start.y + Math.sin(angle) * radius
        };
    }

    get_arrow_vertices(start, end) {
        let angle = this.repr.get_angle(start, end);
        let offset_angle = Math.PI/4;
        const length = 10;
        let first_angle = angle - offset_angle * 3;
        let second_angle = angle + offset_angle * 3;
        return [
            {
                x: end.x + Math.cos(first_angle) * length,
                y: end.y + Math.sin(first_angle) * length,
            },

            {
                x: end.x + Math.cos(second_angle) * length,
                y: end.y + Math.sin(second_angle) * length,
            }
        ]
    }

    print_weight(start, end) {
        const dist = 20;
        let offset_angle = Math.PI / 2;
        if (end.x < start.x) offset_angle *= -1;
        let angle = this.repr.get_angle(start, end) - offset_angle;
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
        let tempcolor = this.repr.context.strokeStyle;
        this.repr.context.strokeStyle = this.draw_color;

        this.print_weight(border_start,border_end);
        this.repr.context.lineWidth = this.lineWidth;
        let temp = this.repr.context.lineCap;
        this.repr.context.lineCap = "round";
        this.repr.draw_line(border_start, border_end);
        if (this.print_arrow) {
            let [arrow1, arrow2] = this.get_arrow_vertices(border_start, border_end);
            this.repr.draw_line(border_end, arrow1);
            this.repr.draw_line(border_end, arrow2);
        }

        this.repr.context.lineWidth = 1;
        this.repr.context.lineCap = temp;
        this.repr.context.strokeStyle = tempcolor;
    }

}

export { DEdge };