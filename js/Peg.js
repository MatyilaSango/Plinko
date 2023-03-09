class Peg {
    constructor(x, y, anchor, width, height, radius){
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height
        this.radius = radius
    }

    create(){
        let peg = PIXI.Sprite.from("./images/circle.png");
        peg.anchor.set(this.anchor);
        peg.x = this.x;
        peg.y = this.y;
        peg.width = this.width
        peg.height = this.height
        
        // let peg = new PIXI.Graphics();
        // peg.beginFill(0xA5E3F4);
        // peg.drawCircle(this.x, this.y, this.radius);
        // peg.endFill();

        return peg;
    }
}