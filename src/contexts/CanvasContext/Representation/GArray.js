class GArray{
    static __class_identifier = "GArray";
    static __member_count = 0;
    id = null;
    static geometry = {
        highlight_color: "rgb(56,56,250)",
        index_color: "#333",
        index_highlight_color:"red"
    }
    repr = null;
    array = null;
    label = null;
    dimensions = null;
    measure = null;
    position = null;
    highlight_array = false;
    select_position = { row:-1,col:-1 };
    highlight_indices = null;
    name = null;
    get_cid = () => GArray.__class_identifier;
    get_id = () => this.get_cid() + GArray.__member_count++;
    constructor(representation, {
        value,
        name="",
        show=true,
        dimensions = value[0] instanceof Array ? 2 : 1,
        measure = { x: 30, y: 30 },
        position = {
            x: representation.canvas.width * .4,
            y: representation.canvas.height * .4
        }
    }) {
        this.id = this.get_id();
        this.name = name;
        this.repr = representation;
        this.array = JSON.parse(JSON.stringify(value));
        this.label = JSON.parse(JSON.stringify(value));
        this.dimensions = dimensions;
        this.measure = measure;
        this.position = position;
        this.highlight_indices = new Set();
        if (show) this.show();
    }

    release() {
        this.hide();
        delete this;
    }
    show() {
        this.repr.attach_to_draw(this.get_cid, this);
        this.repr.registerSelection(this.get_cid, this);
        this.repr.registerDragging(this.get_cid(), this);
    }
    hide() {
        this.repr.detach_from_draw(this.get_cid, this);
        this.repr.unregisterSelection(this.get_cid, this);
        this.repr.unregisterDragging(this.get_cid(), this);
    }
    mouse_inside({ x, y }) {
        x -= this.position.x;
        y -= this.position.y;
        if (this.dimensions === 1) {
            return x >= 0 && x <= this.label.length * this.measure.x &&
                y >= 0 && y <= this.measure.y
        }
        if (y >= 0 && y <= this.label.length * this.measure.y) {
            let row = ~~(y / this.measure.y);
            return x >= 0 && x <= this.label[row].length * this.measure.x;
        }
        return false;
    }

    //TODO : improve the effieciency of the draw calls by
    //making a bigger box at the beginning instead of many smaller boxes
    draw_box(array, { x, y }, {
        left=false,top=false
    }) {
        if (left) this.repr.draw_line({ x, y }, { x, y: y + this.measure.y });
        if (top) this.repr.draw_line({ x, y }, { x: x + this.measure.x, y });
        this.repr.draw_line({ x: x + this.measure.x, y }, { x: x + this.measure.x, y: y + this.measure.y });
        this.repr.draw_line({ x, y:y+this.measure.y }, { x: x + this.measure.x, y: y + this.measure.y });
        this.repr.center_text(array, {
            x: x + this.measure.x / 2,
            y: y + this.measure.y / 2
        },this.measure.y / 2+"px").fill();
    }
    draw_single_d(array, position,top_length=0) {
        if (!array.length) return;
        this.draw_box(array[0], {
            x: position.x,
            y: position.y
        },{left:true,top:top_length < 1});
        for (let i = 1; i < array.length; ++i)
            this.draw_box(array[i], {
                x: position.x + i * this.measure.x,
                y: position.y
            }, { top: top_length <= i });
    }
    select({ x, y }) {
        this.highlight_array = true;
        x -= this.position.x;
        y -= this.position.y;
        let row = ~~(y / this.measure.y);
        let col = ~~(x / this.measure.x)
        this.select_position = { row, col };
    }
    unselect() {
        this.highlight_array = false;
    }
    draw_boundary(position, width, height) {
        this.repr.context.strokeStyle = "#aaa";
        if (this.highlight_array) {
            this.repr.context.strokeStyle = "blue"
        }
        if (this.name) {
            let m = this.repr.measure_text(this.name);
            if (position.x + this.measure.x / 2 + m.width > position.x + width) {
                this.repr.center_text(this.name, {
                    x: position.x + width/ 2,
                    y: position.y
                }).fill(this.highlight_array ? "blue" : "#333");
                let gap = 10;
                this.repr.context.beginPath();
                this.repr.context.moveTo(position.x, position.y+m.height/2+5);
                this.repr.context.lineTo(position.x, position.y + height);
                this.repr.context.lineTo(position.x + width, position.y + height);
                this.repr.context.lineTo(position.x + width, position.y+m.height/2+5);
                this.repr.context.stroke();
            } else {
                this.repr.center_text(this.name, {
                    x: position.x + this.measure.x / 2 + m.width / 2,
                    y: position.y
                }).fill(this.highlight_array ? "blue" : "#333");
                let gap = 10;
                this.repr.context.beginPath();
                this.repr.context.moveTo(position.x + this.measure.x / 2 - gap, position.y);
                this.repr.context.lineTo(position.x, position.y);
                this.repr.context.lineTo(position.x, position.y + height);
                this.repr.context.lineTo(position.x + width, position.y + height);
                this.repr.context.lineTo(position.x + width, position.y);
                this.repr.context.lineTo(position.x + this.measure.x / 2 + m.width + gap, position.y);
                this.repr.context.stroke();
            }

        }
        else
            this.repr.context.strokeRect(position.x, position.y, width, height);

        this.repr.context.strokeStyle = this.repr.strokeStyle;
    }
    draw() {
        let hr = new Set();
        let hc = new Set();
        let temp = this.repr.context.strokeStyle;
        if (!this.label.length) return;
        if (this.highlight_array) {
            this.repr.context.strokeStyle = GArray.geometry.highlight_color;
            let { row, col } = this.select_position;
            let t = this.repr.context.fillStyle;
            this.repr.context.fillStyle = GArray.geometry.highlight_color;
            this.repr.context.fillRect(
                this.position.x + col * this.measure.x,
                this.position.y + row * this.measure.y,
                this.measure.x,
                this.measure.y
            );
            this.repr.context.fillStyle = t;
            hr.add(row);
            hc.add(col);
        }

        for (let i of this.highlight_indices.values()) {
            let { row, col } = JSON.parse(i);
            let t = this.repr.context.fillStyle;
            this.repr.context.fillStyle = GArray.geometry.highlight_color;
            this.repr.context.fillRect(
                this.position.x + col * this.measure.x,
                this.position.y + row * this.measure.y,
                this.measure.x,
                this.measure.y
            );
            this.repr.context.fillStyle = t;
            hr.add(row);
            hc.add(col);
        }

        if (this.dimensions === 2) {
            let pos = { ...this.position };
            pos.x -= Math.min(this.measure.x,this.measure.y);
            for (let i = 0; i < this.label.length; ++i) {
                this.repr.center_text(i, {
                    x: pos.x + Math.min(this.measure.x, this.measure.y) / 2,
                    y: pos.y + this.measure.y*i + this.measure.y / 2
                }, "10px").fill(hr.has(i) ? GArray.geometry.index_highlight_color : GArray.geometry.index_color);
            }
            let max_len = this.label[0].length;
            this.draw_single_d(this.label[0], {
                x: this.position.x,
                y: this.position.y,
            });
            for (let i = 1; i < this.label.length; ++i){
                max_len = Math.max(max_len,this.label[i].length)
                this.draw_single_d(this.label[i], {
                    x: this.position.x,
                    y: this.position.y + i * this.measure.y,
                }, this.label[i - 1].length);
            }
            pos = { ...this.position };
            pos.y -= Math.min(this.measure.x, this.measure.y);
            for (let i = 0; i < max_len; ++i) {
                this.repr.center_text(i, {
                    x: this.measure.x * i + pos.x + this.measure.x / 2,
                    y: pos.y + Math.min(this.measure.x, this.measure.y) / 2
                }, "10px").fill(hc.has(i) ? GArray.geometry.index_highlight_color : GArray.geometry.index_color);
            }
            this.draw_boundary(
                { x: pos.x - this.measure.x*.75, y: pos.y - Math.min(this.measure.x, this.measure.y)/2 },
                (max_len + 1.25) * this.measure.x,
                (this.label.length+2)*this.measure.y
            );
        } else {
            this.draw_single_d(this.label, this.position);
            let pos = { ...this.position };
            pos.y += Math.min(this.measure.x, this.measure.y);
            for (let i = 0; i < this.label.length; ++i){
                this.repr.center_text(i, {
                    x: this.measure.x*i + pos.x + this.measure.x / 2,
                    y: pos.y + this.measure.y / 2
                }, "10px").fill(hc.has(i) ? GArray.geometry.index_highlight_color : GArray.geometry.index_color);
            }
        }
        this.repr.context.strokeStyle = temp;
    }

}
export {GArray}