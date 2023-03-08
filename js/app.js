
let app;

let levels = 8
let lines = 2 + levels

window.onload = function () {
    app = new PIXI.Application({
        height: 700,
        backgroundColor: 0x1496c
    })
    
    document.getElementById("canvas").appendChild(app.view)

    let pegs = []
    let slots = []

    let space_bottom = 0

    let fraction = (8/lines)

    for( let i = 3; i <= lines; i++){
        let space_left = 0
        
        //adding spaces
        for(let space = 1; space <= (lines - i); space++){
            space_left += (45 * fraction)
        }

        //adding pags into the grid
        for(let point = 1; point <= i; point++){
            let beg_obj = new Peg(space_left, space_bottom, -3)
            let new_beg = beg_obj.create()
            new_beg.width = 35 - (lines) 
            new_beg.height = 35 - (lines) 

            beg_obj.radius = new_beg.width / 2;
            beg_obj.width = new_beg.width
            beg_obj.height = new_beg.height

            app.stage.addChild(new_beg)

            pegs.push(beg_obj)
            space_left += 90 * fraction

        }

        space_bottom += 80 * fraction

    }
    // let slot_obj = new Slot(50, space_bottom + 80, -3, 100, 100, 0.5)
    // let new_slot = slot_obj.create()
    // new_slot.width = 100 - (lines) 
    // new_slot.height = 100 - (lines) 

    // slot_obj.radius = new_slot.width / 2;

    // app.stage.addChild(new_slot)

    //for(let )




    
  
}

