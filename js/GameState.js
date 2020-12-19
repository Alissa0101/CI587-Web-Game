class GameState{
    constructor(){
        console.log("Init gamestate");

        this.states = {
            NONE: 0,
            MENU: 1,
            STAGE_1: 2,
            BOSS: 3,
            WIN: 4,
            LOSE: 5
        }

        this.state = this.states.NONE;
        this.game;
    }

    //runs constantly checking which state the game should be in
    checkState(){
        switch(this.state){
            case this.states.NONE:
                //If the game is in NONE then it has just started so move to the menu
                this.enterState(this.states.MENU);
                break;
            case this.states.MENU:
                //When in the menu check if the start button has been pressed and switch to STAGE_1
                this.exitState(this.state);
                this.enterState(this.states.STAGE_1);//currently no menu so switch to STAGE_1
                break;
            case this.states.STAGE_1:
                //check if the song has ended and switch to the boss
                if(nm.finished == true){
                    console.log("switch to boss")
                    this.exitState(this.state);
                    this.enterState(this.states.BOSS);
                }
                break;
            case this.states.BOSS:
                if(player.health <= 0){
                    boss.moveToPos(width/2, height/2);
                    //this doesn't work if x is the same as the player and y is different, why?
                    player.movePlayerTween(player.x+1, height+50, 1500, true);
                    this.exitState(this.state)
                    this.enterState(this.states.LOSE)
                }

                //check if the boss has been defeated then switch to WIN
                //if the player has died switch to LOSE
                if(boss.health <= 0){
                    boss.moveToPos(boss.x, height+500);
                    player.movePlayerTween(width/2, height/2, 1500, true);
                    this.exitState(this.state)
                    this.enterState(this.states.WIN)
                }

                //if an arm's health is 0 or less then it can be disabled
                if(boss.left.health <= 0){
                    boss.left.disable();
                }
                if(boss.right.health <= 0){
                    boss.right.disable();
                }

                //if the main body of the boss has 0 health then stop shooting from it
                if(boss.health_main <= 0){
                    boss.canShootFromMain = false;
                }

                //if the boss has lost both arms then half set the shoot delay to a smaller number
                if(boss.left.health <= 0 && boss.right.health <= 0){
                    boss.shootDelay = 1500;
                }
                break;
        }
    }

    //runs when the game should enter a new state
    enterState(stateToEnter){
        switch(stateToEnter){
            case this.states.MENU:
                //Do what ever is needed to start the menu, like set vars that are needed, or something :)
                console.log("Switching to menu")
                this.state = stateToEnter
                break;
            case this.states.STAGE_1:
                //show the 3 lanes, player, and start song

                player.movementType = "lane"//switch movement type to lane

                player.healthBar.width = 0;
                player.healthBarBG.visible = true;
                player.healthBar.visible = true;
                

                //show the lanes and emitter
                nm.lane_left.visible = true;
                nm.lane_middle.visible = true;
                nm.lane_right.visible = true;
                nm.emitter.visible = true;
                //setup the note manager
                nm.createPool();
                //play the song
                nm.playSong(song);
                player.maxHealth = nm.song.pattern.length;
                this.state = stateToEnter
                break;
            case this.states.BOSS:
                //show the boss and enable player shooting
                nm.song.play()
                
                let tempScore = player.score;
                player.score = 0;
                player.health = tempScore;
                
                //hide everything
                

                //switch movement to free
                player.movementType = "free"

                //create all the bullets
                player.gun.createBulletPool();
                player.canShoot = true;

                boss.enable();

                this.state = stateToEnter
                break;
            case this.states.WIN:
                //display a win message
                console.log("WIN")
                this.state = stateToEnter
                break;
            case this.states.LOSE:
                //display a lose message
                console.log("LOSE")
                this.state = stateToEnter
                break;
        }
    }

    //runs when the game exits a state
    exitState(stateToExit){
        switch(stateToExit){
            case this.states.MENU:
                //hide the meny
                break;
            case this.states.STAGE_1:
                //hide everything from this stage
                nm.lane_left.visible = false;
                nm.lane_middle.visible = false;
                nm.lane_right.visible = false;
                nm.emitter.visible = false;
                break;
            case this.states.BOSS:
                //hide everything from the boss
                boss.disable();
                player.disable();
                break;
        }
    }

}