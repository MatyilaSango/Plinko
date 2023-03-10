window.onload = function () {
    let app = new PIXI.Application({
        height: 700,
        backgroundColor: 0x1496c,
    });

    document.getElementById("canvas").appendChild(app.view);

    let initial_level = 8;
    var fraction; //Amount to shrink the pegs and solts by when increasing number of lines
    var slots = []; //Store slots objects
    var pegs = []; //Store pegs objects
    var opening; //Store the openning

    let slot_costs_list = [
        [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
        [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
        [8.9, 3, 1.1, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
        [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
        [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
        [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
        [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
        [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
        [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    ];

    //Setting up the board.
    function setup(levels) {
        let lines = 2 + levels;

        let slot_costs = slot_costs_list[levels - 8];

        pegs = [];
        slots = [];

        fraction = 8 / lines;

        let space_bottom = 150 * fraction;

        //adding pegs into the stage
        for (let i = 3; i <= lines; i++) {
            let space_left = 50;

            //adding spaces
            for (let space = 1; space <= lines - i; space++) {
                space_left += 45 * fraction;
            }

            //adding pags into the grid
            for (let point = 1; point <= i; point++) {
                let beg_obj = new Peg(space_left, space_bottom, 0, 35 - lines, 35 - lines, (35 - lines)/2);
                let new_beg = beg_obj.create();

                app.stage.addChild(new_beg);

                pegs.push(beg_obj);
                space_left += 90 * fraction;
            }

            space_bottom += 80 * fraction;
        }

        //adding slots into the stage
        let slot_costs_space = 0;
        for (let s = 0; s < slot_costs.length; s++) {
            let slot_obj = new Slot((70 ) + slot_costs_space, (space_bottom), 0, (55 - lines), (50 - lines), slot_costs[s]);
            let new_slot = slot_obj.create();

            slot_obj.radius = new_slot.width / 2;

            app.stage.addChild(new_slot);
            slots.push(slot_obj);

            slot_costs_space += 91 * fraction;
        }

        //adding openning into the stage
        opening = PIXI.Sprite.from(`./images/bC.png`);
        opening.anchor.set(0)
        opening.x = pegs[1].x - (8 * fraction);
        opening.y = (50 * fraction);
        opening.width = 50 * fraction;
        opening.height = 50 * fraction;
        app.stage.addChild(opening);

        document.getElementById("play-button").addEventListener("click", () => {
            setTimeout(start, 0)
        })

    }

    function destroyApp() {
        document.getElementById("canvas").removeChild(app.view);

        app = new PIXI.Application({
            height: 700,
            backgroundColor: 0x1496c,
        });

        document.getElementById("canvas").appendChild(app.view);
    }

    function start() {
        var pinkBall = PIXI.Sprite.from(`./images/pink_ball.png`);

        pinkBall.x = opening.x + (5 * fraction);
        pinkBall.y = opening.y;
        pinkBall.width = 35 * fraction;
        pinkBall.height = 35 * fraction;
        pinkBall.vy = 0;
        pinkBall.vx = 0;
        app.stage.addChild(pinkBall);

        let last_peg = undefined;

        app.ticker.add(function(delta){
            pinkBall.y += pinkBall.vy
            pinkBall.vy += 0.5
            if(pinkBall.y > app.view.height - 50){
                pinkBall.vy *= -0.5
                pinkBall.y += pinkBall.vy
            }

            for(let pegIndx = 0; pegIndx < pegs.length; pegIndx++){
                
                if(isCollision(pegs[pegIndx].x - (5 * fraction), pegs[pegIndx].y, pegs[pegIndx].radius, pinkBall.x, pinkBall.y, pinkBall.width / 2)){
                    current_peg = pegs[pegIndx]
                    pinkBall.vy *= -0.5
                    pinkBall.y += pinkBall.vy
                    pinkBall.vx = 4

                    if(current_peg != last_peg){
                        randomTurn = Math.floor(Math.random() * 2);
                        last_peg = current_peg
                    }

                    if(randomTurn === 0){
                        pinkBall.x -= pinkBall.vx
                    }
                    else if(randomTurn === 1){
                        pinkBall.x += pinkBall.vx
                    }
                    //randomTurn = Math.floor(Math.random() * 2);
                    break;
                    
                }
            }
            
            for(let slotIndx = 0; slotIndx < slots.length; slotIndx++){
                if(isCollision(slots[slotIndx].x, slots[slotIndx].y, slots[slotIndx].radius, pinkBall.x, pinkBall.y, pinkBall.width / 2)){
                    app.stage.removeChild(pinkBall)
                }
            }
        })

    }

    function isCollision(peg_x, peg_y, peg_r, pink_ball_x, pink_ball_y, pink_ball_r) {
        let squareDistance = (peg_x-pink_ball_x)*(peg_x-pink_ball_x) + (peg_y-pink_ball_y)*(peg_y-pink_ball_y);

        return squareDistance <= ((peg_r + pink_ball_r) * (peg_r + pink_ball_r))
    }

    setup(initial_level);   

    app.stage.interactive = true;

    document.querySelectorAll("#canvas-option_div").forEach((op) => {
        op.addEventListener("click", function (e) {
            new_level = e.target.innerHTML;
            destroyApp();
            setup(Number(new_level));
        });
    });
};
