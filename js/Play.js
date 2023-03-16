class Play {

    constructor(opening, app, fraction, pegs, slots, bet){
        this.opening = opening
        this.app = app
        this.fraction = fraction
        this.pegs = pegs
        this.slots = slots
        this.pinkBall = PIXI.Sprite.from(`./images/pink_ball.png`);
        this.cost_scored = 0
        this.bet = bet
        this.time = Date().split(" ")[4]
        this.slotCost = 0
    }

    //Start game
    start() {
        window.document.getElementById("points-bet-wrapper__won-flash").classList.remove("points-bet-wrapper__won-flash__animate")
        this.pinkBall.x = this.opening.x + (5 * this.fraction);
        this.pinkBall.y = this.opening.y;
        this.pinkBall.width = 35 * this.fraction;
        this.pinkBall.height = 35 * this.fraction;
        this.pinkBall.vy = 0;
        this.pinkBall.vx = 0;
        this.app.stage.addChild(this.pinkBall);
    
        let last_peg = undefined;
        let randomTurn = Math.floor(Math.random() * 2);
    
        let that = this
        this.app.ticker.add(function(){
            that.pinkBall.y += that.pinkBall.vy
            that.pinkBall.vy += 0.8
    
            for(let pegIndx = 0; pegIndx < that.pegs.length; pegIndx++){
                
                if(that.isCollision(that.pegs[pegIndx].x - (1 * that.fraction), that.pegs[pegIndx].y, that.pegs[pegIndx].radius, that.pinkBall.x, that.pinkBall.y, that.pinkBall.width / 2)){
    
                    //play sound effect
                    let collisionSoundEffect = new Audio("./Sound Effects/collisionEffect.wav")
                    collisionSoundEffect.volume = 0.2
                    collisionSoundEffect.play()
    
                    let current_peg = that.pegs[pegIndx]
    
                    that.pinkBall.vy *= -0.5
                    that.pinkBall.y += that.pinkBall.vy
                    that.pinkBall.vx = 9 * that.fraction
    
                    if(current_peg != last_peg){
                        randomTurn = Math.floor(Math.random() * 2);
                        last_peg = current_peg
                    }
    
                    if(randomTurn === 0){
                        that.pinkBall.x -= that.pinkBall.vx
                    }

                    else if(randomTurn === 1){
                        that.pinkBall.x += that.pinkBall.vx
                    }
    
                    break;
                }
            }
            
            for(let slotIndx = 0; slotIndx < that.slots.length; slotIndx++){
                if(that.isCollision(that.slots[slotIndx].x, that.slots[slotIndx].y + 40, that.slots[slotIndx].width / 2, that.pinkBall.x, that.pinkBall.y, that.pinkBall.width / 2)){
                    that.app.stage.removeChild(that.pinkBall)
                    let scoredSoundEffect = new Audio("./Sound Effects/scoreEffect.wav")
                    scoredSoundEffect.volume = 0.2
                    scoredSoundEffect.play()
                    if(that.cost_scored === 0){
                        that.slotCost = that.slots[slotIndx].cost
                        that.cost_scored = that.roundToTwoDecimal( that.getCostScored(that.bet, that.slotCost ) )
                        window.points += that.cost_scored
                        window.points = that.roundToTwoDecimal(window.points)
                        window.document.getElementById("points-won").innerHTML = that.cost_scored
                        document.getElementById("points-bet-wrapper__points--player-points").innerHTML = window.points
                        window.document.getElementById("points-bet-wrapper__won-flash").classList.add("points-bet-wrapper__won-flash__animate")
                        window.document.getElementById("game-history-table-body").innerHTML += 
                            `<tr>
                                <td colspan="1">${that.time}</td>
                                <td>${that.bet}</td>
                                <td>${that.slotCost}x</td>
                                ${(that.cost_scored > that.bet) 
                                ?  
                                `<td class="td-won">+${that.cost_scored}</td>`
                                :
                                (that.cost_scored < that.bet)
                                ?
                                `<td class="td-lost">-${that.cost_scored}</td>`
                                :
                                `<td>${that.cost_scored}</td>`
                                }
                            </tr>`
                            
                        let tableWrapper = window.document.getElementById("table-wrapper")
                        tableWrapper.scrollTop = tableWrapper.scrollHeight
                    }  
                }
            }
        })
    }

    //Checking of there's a collisiong between two objects
    isCollision(peg_x, peg_y, peg_r, pink_ball_x, pink_ball_y, pink_ball_r) {
        let squareDistance = (peg_x-pink_ball_x)*(peg_x-pink_ball_x) + (peg_y-pink_ball_y)*(peg_y-pink_ball_y);
        return squareDistance <= ((peg_r + pink_ball_r) * (peg_r + pink_ball_r))
    }

    //Calculate and return the cost scored
    getCostScored(bet, slot_cost){
        return bet * slot_cost;
    }

    //Rounding to two decimal places
    roundToTwoDecimal(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }
}