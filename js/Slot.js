class Slot {
    constructor( x, y, anchor, width, height, cost){
        //sthis.context = context
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height
        this.cost = cost
    }

    create(){
        let peg = PIXI.Sprite.from(`./images/${this.cost}.png`);
        peg.anchor.set(this.anchor);
        peg.x = this.x;
        peg.y = this.y;

        return peg;
    }
}