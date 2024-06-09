var fraction; //Amount to shrink the pegs and solts by when increasing number of lines
var slots = []; //Store slots objects
let initial_level = 8; // Initial game lines.
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
var pegs = []; //Store pegs objects
var openning; //Store the openning
var bet = 1.00; //Bet amount
var points = 100 //Amount of points
let music;
var top_bounce = 0.5;
var incr_weight_value = 0;
var side_bounce = 4

/**
 * Class peg represent a peg in the board
 */
class Peg {

    /**
     * Creates an instance of the Peg.
     * 
     * @param {number} x The x postion
     * @param {number} y They y position
     * @param {number} anchor The anchor position
     * @param {number} width The width of the peg
     * @param {number} height The height of the peg 
     * @param {*number} radius The radius of the peg
     */
    constructor(x, y, anchor, width, height, radius) {
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height
        this.radius = radius
        this.pegBall = null
    }

    /**
     * Creates a new peg
     * 
     * @returns new peg
     */
    create() {
        let peg = PIXI.Sprite.from("./images/circle.png");
        peg.anchor.set(this.anchor);
        peg.x = this.x;
        peg.y = this.y;
        peg.width = this.width
        peg.height = this.height

        this.pegBall = peg

        return peg;
    }
}

/**
 * Class Slot represent a slot in the board
 */
class Slot {

    /**
     * Creates an instance of the Slot.
     * 
     * @param {number} x The x postion
     * @param {number} y They y position
     * @param {number} anchor The anchor position
     * @param {number} width The width of the slot
     * @param {number} height The height of the slot
     * @param {number} cost The slot cost
     */
    constructor(x, y, anchor, width, height, cost) {
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height
        this.cost = cost
        this.anchor = 0
        this.radius = 0
        this.slot = null
    }

    /**
     * Creates a new slot
     * 
     * @returns new slot
     */
    create() {
        let slot = PIXI.Sprite.from(`./images/${this.cost}.png`);
        slot.anchor.set(this.anchor);
        slot.x = this.x;
        slot.y = this.y;
        slot.width = this.width;
        slot.height = this.height
        this.slot = slot

        return slot;
    }
}

/**
 * Class Play plays the game
 */
class Play {

    /**
     * Creates an instance of Play for each ball being played.
     * 
     * @param {number} openning Openning
     * @param {number} app App
     * @param {number} fraction Fraction
     * @param {number} pegs Pegs
     * @param {number} slots Slots
     * @param {number} bet Bet
     */
    constructor(openning, app, fraction, pegs, slots, bet, top_bounce, side_bounce) {
        this.openning = openning
        this.app = app
        this.fraction = fraction
        this.pegs = pegs
        this.slots = slots
        this.pinkBall = PIXI.Sprite.from(`./images/pink_ball.png`);
        this.cost_scored = 0
        this.bet = bet
        this.time = Date().split(" ")[4]
        this.slotCost = 0
        this.top_bounce = top_bounce
        this.side_bounce = side_bounce
    }

    /**
     * Plays the game for each new ball and keeps track of it throughout its lifespan.
     * 
     */
    start() {
        window.document.getElementById("points-bet-wrapper__won-flash").classList.remove("points-bet-wrapper__won-flash__animate")
        this.pinkBall.x = this.openning.x + (5 * this.fraction);
        this.pinkBall.y = this.openning.y;
        this.pinkBall.width = 35 * this.fraction;
        this.pinkBall.height = 35 * this.fraction;
        this.pinkBall.vy = 0;
        this.pinkBall.vx = 0;
        this.app.stage.addChild(this.pinkBall);

        let last_peg = undefined;
        let randomTurn = Math.floor(Math.random() * 2);

        let that = this
        this.app.ticker.add(function () {
            that.pinkBall.y += that.pinkBall.vy
            that.pinkBall.vy += 0.8

            for (let pegIndx = 0; pegIndx < that.pegs.length; pegIndx++) {

                if (that.isCollision(that.pegs[pegIndx].x - (1 * that.fraction), that.pegs[pegIndx].y, that.pegs[pegIndx].radius, that.pinkBall.x, that.pinkBall.y, that.pinkBall.width / 2)) {

                    that.pegs[pegIndx].pegBall.tint = 0xF101C4
                    setTimeout(() => {
                        that.pegs[pegIndx].pegBall.tint = 0xffffff
                    }, 100)

                    let collisionSoundEffect = new Audio("./Sound Effects/collisionEffect.wav")
                    collisionSoundEffect.volume = 0.2
                    collisionSoundEffect.play()

                    let current_peg = that.pegs[pegIndx]

                    that.pinkBall.vy *= -that.top_bounce
                    that.pinkBall.y += that.pinkBall.vy
                    that.pinkBall.vx += that.side_bounce
                    that.pinkBall.vx = that.pinkBall.vx * that.fraction

                    if (current_peg != last_peg) {
                        randomTurn = Math.floor(Math.random() * 2);
                        last_peg = current_peg
                    }

                    if (randomTurn === 0) {
                        that.pinkBall.x -= that.pinkBall.vx
                    }

                    else if (randomTurn === 1) {
                        that.pinkBall.x += that.pinkBall.vx
                    }

                    break;
                }
            }

            for (let slotIndx = 0; slotIndx < that.slots.length; slotIndx++) {
                if (that.isCollision(that.slots[slotIndx].x, that.slots[slotIndx].y + 40, that.slots[slotIndx].width / 2, that.pinkBall.x, that.pinkBall.y, that.pinkBall.width / 2)) {
                    that.app.stage.removeChild(that.pinkBall)
                    let scoredSoundEffect = new Audio("./Sound Effects/scoreEffect.wav")
                    scoredSoundEffect.volume = 0.2
                    scoredSoundEffect.play()
                    if (that.cost_scored === 0) {
                        that.slotCost = that.slots[slotIndx].cost
                        that.cost_scored = that.roundToTwoDecimal(that.getCostScored(that.bet, that.slotCost))
                        window.points += that.cost_scored
                        window.points = that.roundToTwoDecimal(window.points)
                        window.document.getElementById("points-won").innerHTML = that.cost_scored
                        document.getElementById("points-bet-wrapper__points--player-points").innerHTML = window.points
                        window.document.getElementById("points-bet-wrapper__won-flash").classList.add("points-bet-wrapper__won-flash__animate")

                        let tableGameHistory =  window.document.getElementById("game-history-table-body").innerHTML
                        tableGameHistory =
                            `<tr>
                                <td colspan="1">${that.time}</td>
                                <td>${that.bet}</td>
                                <td>${that.slotCost}x</td>
                                ${(that.cost_scored > that.bet)
                                ?
                                `<td class="td-won"><div>${that.cost_scored}</div></td>`
                                :
                                (that.cost_scored < that.bet)
                                    ?
                                    `<td class="td-lost"><div>${that.cost_scored}</div></td>`
                                    :
                                    `<td class="td-no-gain"><div>${that.cost_scored}</div></td>`
                            }
                            </tr>` + tableGameHistory;

                        let tableWrapper = window.document.getElementById("table-wrapper");
                        tableWrapper.scrollTop = tableWrapper.scrollHeight;

                        that.slots[slotIndx].slot.y += 10
                        setTimeout(() => {
                            that.slots[slotIndx].slot.y -= 10
                        }, 50);
                    }
                }
            }
        })
    }

    /**
     * Detecting a collision between a beg and a ball.
     * 
     * @param {number} peg_x The x position of the peg.
     * @param {number} peg_y The y position of the peg.
     * @param {number} peg_r The radius of the peg.
     * @param {number} ball_x The x position of the ball.
     * @param {number} ball_y The y position of the ball.
     * @param {number} ball_r The radius of the ball.
     * @returns true of collision is detected or else false.
     */
    isCollision(peg_x, peg_y, peg_r, ball_x, ball_y, ball_r) {
        let circleDistance = (peg_x - ball_x) * (peg_x - ball_x) + (peg_y - ball_y) * (peg_y - ball_y);
        return circleDistance <= ((peg_r + ball_r) * (peg_r + ball_r))
    }

    /**
     * Get amount of points won.
     * 
     * @param {number} bet The bet.
     * @param {number} slot_cost The slot cost.
     * @returns points/score.
     */
    getCostScored(bet, slot_cost) {
        return bet * slot_cost;
    }

    /**
     * Round value to two decimal places.
     * 
     * @param {nunber} num Value
     * @returns rounded value.
     */
    roundToTwoDecimal(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
}

window.onload = function () {

    let app = new PIXI.Application({
        height: 700,
        backgroundColor: 0x1496c,
    });

    app.stage.interactive = true;

    /**
     * Setting up the board and fill it with pegs and slots based on the number of lines provided.
     * 
     * @param {number} levels 
     */
    function setup(levels) {
        let lines = 2 + levels;

        let slot_costs = slot_costs_list[levels - 8];

        pegs = [];
        slots = [];

        fraction = 7 / lines;

        let space_bottom = 150 * fraction;

        for (let i = 3; i <= lines; i++) {
            let space_left = 50;

            for (let space = 1; space <= lines - i; space++) {
                space_left += 50 * fraction;
            }

            for (let point = 1; point <= i; point++) {
                let beg_obj = new Peg(space_left, space_bottom, 0, 30 * fraction, 30 * fraction, 30 * fraction / 2);
                let new_beg = beg_obj.create();

                app.stage.addChild(new_beg);

                pegs.push(beg_obj);
                space_left += 100 * fraction;
            }

            space_bottom += 90 * fraction;
        }

        for (let s = 0; s < slot_costs.length; s++) {
            let temp_bottom_peg = pegs[pegs.length - 1 - slot_costs.length + s] // taking each bottom peg so its x can be used as a referrence point for each slot
            let slot_obj = new Slot(temp_bottom_peg.x + temp_bottom_peg.width * fraction, (space_bottom), 0, (55 - lines), (50 - lines), slot_costs[s]);
            let new_slot = slot_obj.create();

            app.stage.addChild(new_slot);
            slots.push(slot_obj);
        }

        openning = PIXI.Sprite.from(`./images/bC.png`);
        openning.anchor.set(0)
        openning.x = pegs[1].x - (8 * fraction);
        openning.y = (50 * fraction);
        openning.width = 50 * fraction;
        openning.height = 50 * fraction;
        app.stage.addChild(openning);
    }


    /**
     * Destroys a canvas and creates a new one.
     * 
     */
    function destroyApp() {
        document.getElementById("canvas").removeChild(app.view);

        app = new PIXI.Application({
            height: 700,
            backgroundColor: 0x1496c,
        });

        document.getElementById("canvas").appendChild(app.view);
    }

    /**
     * Round value to two decimal places.
     * 
     * @param {nunber} num Value
     * @returns rounded value.
     */
    function roundToTwoDecimal(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    setup(initial_level);

    document.getElementById("canvas").appendChild(app.view);

    music = new Audio("./Sound Effects/background_music.mp3")
    music.loop = true
    music.volume = 0.03

    document.body.addEventListener("mousemove", () => { music.play() })

    let canvas_option_divs = document.querySelectorAll("#canvas-option_div")
    canvas_option_divs.forEach((op) => {
        op.addEventListener("click", function (e) {
            let new_level = e.target.innerHTML;
            destroyApp();
            setup(Number(new_level));

            canvas_option_divs.forEach(line_number => {
                line_number.classList.remove("selected-line")
                if (new_level === line_number.innerHTML) {
                    line_number.classList.add("selected-line")
                }
            })
        });
    });

    document.getElementById("points-bet-wrapper__points--player-points").innerHTML = points

    document.getElementById("points-bet-wrapper__bet--increase").addEventListener("click", () => {
        if (points > bet) {
            bet += 1.00;
            document.getElementById("points-bet-wrapper__bet--amount").innerHTML = `${bet}.00`;
        }
    })

    document.getElementById("points-bet-wrapper__bet--decrease").addEventListener("click", () => {
        if (bet > 1.00) {
            bet -= 1.00;
            document.getElementById("points-bet-wrapper__bet--amount").innerHTML = `${bet}.00`;
        }
    })

    document.getElementById("play-button").addEventListener("click", () => {
        if (points > 0 && bet <= points) {
            points -= bet
            points = roundToTwoDecimal(points)
            document.getElementById("points-bet-wrapper__points--player-points").innerHTML = points
            new Play(openning, app, fraction, pegs, slots, bet, top_bounce, side_bounce).start()
        }
    })

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            music.play()
        }
        else {
            music.pause()
        }
    })

    document.getElementById("start-button-wrapper__button").addEventListener("click", () => {
        document.getElementById("game-info-wrapper").style.display = "none"
    })

    document.getElementById("info-logo").addEventListener("click", () => {
        document.getElementById("game-info-wrapper").style.display = "flex"
    })

    document.getElementById("points-bet-wrapper__weight--increase").addEventListener("click", () => {
        if (top_bounce <= 0.5 && top_bounce > 0.1) {
            top_bounce -= 0.01;
            side_bounce -= 0.05
            incr_weight_value += 1
            document.getElementById("points-bet-wrapper__weight--amount").innerHTML = `${50 + incr_weight_value}`;
        }
    })

    document.getElementById("points-bet-wrapper__weight--decrease").addEventListener("click", () => {
        if (top_bounce < 0.5 && top_bounce >= 0.0) {
            top_bounce += 0.01;
            side_bounce += 0.05
            incr_weight_value -= 1
            document.getElementById("points-bet-wrapper__weight--amount").innerHTML = `${50 + incr_weight_value}`;
        }
    })

};
