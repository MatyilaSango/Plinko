class Peg {
    constructor(x, y, anchor, width, height){
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height
    }

    create(){
        let peg = PIXI.Sprite.from("./images/circle.png");
        peg.anchor.set(this.anchor);
        peg.x = this.x;
        peg.y = this.y;

        return peg;
    }
}