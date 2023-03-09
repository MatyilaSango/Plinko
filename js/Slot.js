class Slot {
    constructor( x, y, anchor, width, height, cost){
        //sthis.context = context
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height
        this.cost = cost
        this.anchor = 0
        this.radius = 0
    }

    create(){
        let peg = PIXI.Sprite.from(`./images/${this.cost}.png`);
        peg.anchor.set(this.anchor);
        peg.x = this.x;
        peg.y = this.y;
        peg.width = this.width;
        peg.height = this.height

        return peg;
    }
}