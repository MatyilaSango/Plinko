window.onload = function () {
    let app = new PIXI.Application({
        height: 700,
        backgroundColor: 0x1496c,
    });

    document.getElementById("canvas").appendChild(app.view);

    let initial_level = 8;
    var fraction;
    var slots; //Store slots 
    var pegs; //Store pegs 
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

        let space_bottom = 0;

        fraction = 8 / lines;

        for (let i = 3; i <= lines; i++) {
            let space_left = 0;

            //adding spaces
            for (let space = 1; space <= lines - i; space++) {
                space_left += 45 * fraction;
            }

            //adding pags into the grid
            for (let point = 1; point <= i; point++) {
                let beg_obj = new Peg(space_left, space_bottom, -3, 35 - lines, 35 - lines, (35 - lines)/2);
                let new_beg = beg_obj.create();

                app.stage.addChild(new_beg);

                pegs.push(beg_obj);
                space_left += 90 * fraction;
            }

            space_bottom += 80 * fraction;
        }

        let slot_costs_space = 0;
        for (let s = 0; s < slot_costs.length; s++) {
            let slot_obj = new Slot((120 * fraction) + slot_costs_space, (space_bottom + 60), -3, (55 - lines), (50 - lines), slot_costs[s]);
            let new_slot = slot_obj.create();

            slot_obj.radius = new_slot.width / 2;

            app.stage.addChild(new_slot);
            slots.push(slot_obj);

            slot_costs_space += 91 * fraction;
        }

        opening = PIXI.Sprite.from(`./images/bC.png`);
        opening.anchor.set(this.anchor);
        opening.x = app.view.width / 2 - 10;
        opening.y = 10;
        opening.width = 50 * fraction;
        opening.height = 50 * fraction;
        app.stage.addChild(opening);
    }

    function destroyApp() {
        document.getElementById("canvas").removeChild(app.view);

        app = new PIXI.Application({
            height: 700,
            backgroundColor: 0x1496c,
        });

        document.getElementById("canvas").appendChild(app.view);
    }

    setup(initial_level);

    app.stage.interactive = true;

    document.querySelectorAll("#canvas-option_div").forEach((op) => {
        op.addEventListener("click", function (e) {
            new_level = e.target.innerHTML;
            console.log(new_level);
            destroyApp();
            setup(Number(new_level));
        });
    });
};
