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
    value = null;
    dimensions = null;
    measure = null;
    position = null;
    highlight_array = false;
    select_position = { row:-1,col:-1 };
    highlight_indices = [];
    get_cid = () => GArray.__class_identifier;
    get_id = () => this.get_cid() + GArray.__member_count++;
    constructor(representation, {
        value,
        dimensions = 1,
        measure = { x: 30, y: 30 },
        position = {
            x: representation.canvas.width * Math.random(),
            y: representation.canvas.height * Math.random()
        }
    }) {
        this.id = this.get_id();
        this.repr = representation;
        this.value = value;
        this.dimensions = dimensions;
        this.measure = measure;
        this.position = position;
        this.repr.attach_to_draw(this.get_cid, this);
        this.repr.registerSelection(this.get_cid, this);
        this.repr.registerDragging(this.get_cid(), this);
    }
    release() {
        this.repr.detach_from_draw(this.get_cid, this);
        this.repr.unregisterSelection(this.get_cid, this);
        this.repr.unregisterDragging(this.get_cid(), this);
    }
    mouse_inside({ x, y }) {
        x -= this.position.x;
        y -= this.position.y;
        if (this.dimensions == 1) {
            return x >= 0 && x <= this.value.length * this.measure.x &&
                y >= 0 && y <= this.measure.y
        }
        if (y >= 0 && y <= this.value.length * this.measure.y) {
            let row = ~~(y / this.measure.y);
            return x >= 0 && x <= this.value[row].length * this.measure.x;
        }
        return false;
    }

    //TODO : improve the effieciency of the draw calls by
    //making a bigger box at the beginning instead of many smaller boxes
    draw_box(value, { x, y }, {
        left=false,top=false
    }) {
        if (left) this.repr.draw_line({ x, y }, { x, y: y + this.measure.y });
        if (top) this.repr.draw_line({ x, y }, { x: x + this.measure.x, y });
        this.repr.draw_line({ x: x + this.measure.x, y }, { x: x + this.measure.x, y: y + this.measure.y });
        this.repr.draw_line({ x, y:y+this.measure.y }, { x: x + this.measure.x, y: y + this.measure.y });
        this.repr.center_text(value, {
            x: x + this.measure.x / 2,
            y: y + this.measure.y / 2
        }).fill();
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
    highlight_index({ row, col }) {
        this.highlight_indices.push({ row, col });
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
    draw() {
        let hr = new Set();
        let hc = new Set();
        let temp = this.repr.context.strokeStyle;
        if (!this.value.length) return;
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

        for (let i in this.highlight_indices) {
            let { row, col } = this.highlight_indices[i];
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

        if (this.dimensions == 2) {


            
            let pos = { ...this.position };
            pos.x -= Math.min(this.measure.x,this.measure.y);
            for (let i = 0; i < this.value.length; ++i) {
                this.repr.center_text(i, {
                    x: pos.x + Math.min(this.measure.x, this.measure.y) / 2,
                    y: pos.y + this.measure.y*i + this.measure.y / 2
                }, "10px").fill(hr.has(i) ? GArray.geometry.index_highlight_color : GArray.geometry.index_color);
            }
            let max_len = this.value[0].length;
            this.draw_single_d(this.value[0], {
                x: this.position.x,
                y: this.position.y,
            });
            for (let i = 1; i < this.value.length; ++i){
                max_len = Math.max(max_len,this.value[i].length)
                this.draw_single_d(this.value[i], {
                    x: this.position.x,
                    y: this.position.y + i * this.measure.y,
                }, this.value[i - 1].length);
            }
            pos = { ...this.position };
            pos.y -= Math.min(this.measure.x, this.measure.y);
            for (let i = 0; i < max_len; ++i) {
                this.repr.center_text(i, {
                    x: this.measure.x * i + pos.x + this.measure.x / 2,
                    y: pos.y + Math.min(this.measure.x, this.measure.y) / 2
                }, "10px").fill(hc.has(i) ? GArray.geometry.index_highlight_color : GArray.geometry.index_color);
            }
        } else {
            this.draw_single_d(this.value, this.position);
            let pos = { ...this.position };
            pos.x += Math.min(this.measure.x, this.measure.y);
            for (let i = 0; i < this.value.length; ++i){
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