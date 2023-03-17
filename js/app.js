var fraction; //Amount to shrink the pegs and solts by when increasing number of lines
var slots = []; //Store slots objects
var pegs = []; //Store pegs objects
var opening; //Store the openning
var bet = 1.00; //Bet amount
var points = 100 //Amount of points
let currentSelectedLines = 8
let music;

window.onload = function () {

    //Creating a canvas for the game
    let app = new PIXI.Application({
        height: 700,
        backgroundColor: 0x1496c,
    });

    //Add the canvas in the document
    document.getElementById("canvas").appendChild(app.view);

    //adding a background music to the game
    music = new Audio("./Sound Effects/background_music.mp3")
    music.loop = true
    music.volume = 0.2

    //Activating the background music to start play when user interacts with the screen
    document.body.addEventListener("mousemove", () => { music.play() })


    let initial_level = 8; // Initial lines when the game gets booted.


    let slot_costs_list = [
        [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6], // 8 lines slot costs
        [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6], // 9 lines slot costs
        [8.9, 3, 1.1, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9], // 10 lines slot costs
        [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4], // 11 lines slot costs
        [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10], // 12 lines slot costs
        [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1], // 13 lines slot costs
        [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1], // 14 lines slot costs
        [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15], // 15 lines slot costs
        [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16], // 16 lines slot costs
    ];

    //Setting up the board.
    function setup(levels) {
        let lines = 2 + levels;

        let slot_costs = slot_costs_list[levels - 8];

        pegs = []; //keeping track of the pegs in the game
        slots = []; //keeping track of the slots in the ga,e

        fraction = 7 / lines; // amount to shrink the game objects by when we increase the number of lines

        let space_bottom = 150 * fraction;

        //adding pegs into the stage
        for (let i = 3; i <= lines; i++) {
            let space_left = 50;

            //adding spaces
            for (let space = 1; space <= lines - i; space++) {
                space_left += 50 * fraction;
            }

            //adding pags into the grid
            for (let point = 1; point <= i; point++) {
                let beg_obj = new Peg(space_left, space_bottom, 0, 30 * fraction, 30 * fraction, 30 * fraction / 2);
                let new_beg = beg_obj.create();

                app.stage.addChild(new_beg);

                pegs.push(beg_obj);
                space_left += 100 * fraction;
            }

            space_bottom += 90 * fraction;
        }

        //adding slots into the stage
        for (let s = 0; s < slot_costs.length; s++) {
            let temp_bottom_peg = pegs[pegs.length - 1 - slot_costs.length + s] // taking each bottom peg so its x can be used as a referrence point for each slot
            let slot_obj = new Slot(temp_bottom_peg.x + temp_bottom_peg.width * fraction, (space_bottom), 0, (55 - lines), (50 - lines), slot_costs[s]);
            let new_slot = slot_obj.create();

            app.stage.addChild(new_slot);
            slots.push(slot_obj);
        }

        //adding openning into the stage
        opening = PIXI.Sprite.from(`./images/bC.png`);
        opening.anchor.set(0)
        opening.x = pegs[1].x - (8 * fraction);
        opening.y = (50 * fraction);
        opening.width = 50 * fraction;
        opening.height = 50 * fraction;
        app.stage.addChild(opening);
    }

    //Destroy the board
    function destroyApp() {
        document.getElementById("canvas").removeChild(app.view);

        app = new PIXI.Application({
            height: 700,
            backgroundColor: 0x1496c,
        });

        document.getElementById("canvas").appendChild(app.view);
    }

    //To round to two decimal
    function roundToTwoDecimal(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    setup(initial_level);

    app.stage.interactive = true; // making the stage to be interactive

    //adding event listerners to all lines options to be able to create a new board with different beg lines
    let canvas_option_divs = document.querySelectorAll("#canvas-option_div")
    canvas_option_divs.forEach((op) => {
        op.addEventListener("click", function (e) {
            let new_level = e.target.innerHTML; //getting a new line number
            destroyApp(); // destroying the old board
            setup(Number(new_level)); // setting up a new board

            //setting the background of a selected line
            canvas_option_divs.forEach(line_number => {
                line_number.classList.remove("selected-line")
                if (new_level === line_number.innerHTML) {
                    line_number.classList.add("selected-line")
                }
            })
        });
    });

    document.getElementById("points-bet-wrapper__points--player-points").innerHTML = points

    // adding event listener for increasing bet number
    document.getElementById("points-bet-wrapper__bet--increase").addEventListener("click", () => {
        if (points > bet) {
            bet += 1.00;
            document.getElementById("points-bet-wrapper__bet--amount").innerHTML = `${bet}.00`;
        }
    })

    // adding event listener for decreasing bet number
    document.getElementById("points-bet-wrapper__bet--decrease").addEventListener("click", () => {
        if (bet > 1.00) {
            bet -= 1.00;
            document.getElementById("points-bet-wrapper__bet--amount").innerHTML = `${bet}.00`;
        }
    })

    // adding event listener on the play button to play the game.
    document.getElementById("play-button").addEventListener("click", () => {
        if (points > 0 && bet <= points) {
            points -= bet
            points = roundToTwoDecimal(points)
            document.getElementById("points-bet-wrapper__points--player-points").innerHTML = points
            new Play(opening, app, fraction, pegs, slots, bet).start()
        }
    })

    // adding event listener to play when tab is vissible
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            music.play()
        }
        else {
            music.pause()
        }
    })

    //Removing game info on button start clicked
    document.getElementById("start-button-wrapper__button").addEventListener("click", () => {
        document.getElementById("game-info-wrapper").style.display = "none"
    })

     //adding game info on logo info clicked
     document.getElementById("info-logo").addEventListener("click", () => {
        document.getElementById("game-info-wrapper").style.display = "flex"
    })

};
