//The BossArm class is used for the two arms on the boss
//Using a class is the best option for this because they are identicle
//the only difference is their position
class BossArm{
    constructor(x, y){
        this.sprite = undefined;
        this.offsetX = x;
        this.offsetY = y;
        this.healthNum = 25;
        this.gun = undefined;
        this.shootDelay = 500;
        this.lastShootTime = 0;
        this.canShoot = true;
        this.mainHealthBarUpdate;
    }

    set health(health){
        if(health >= 0){
            this.healthNum = health;
        }
        this.mainHealthBarUpdate();
    }

    get health(){
        return this.healthNum;
    }

    disable(){
        this.canShoot = false;
        this.sprite.visible = false
    }

}

class Boss{
    constructor(){
        this.game;
        this.sprite;
        this.isEnabled = false;
        this.xPos = 0;
        this.yPos = 0;
        this.healthNum = 200;//heath of the boss's body
        this.healthBarBG;
        this.healthBar;
        this.maxHealth = 0;

        this.left = new BossArm(-175, 0);
        this.right = new BossArm(175, 0);

        this.shootDelay = 3000;
        this.lastShootTime = 0;

        this.gun = undefined;
        this.canShoot = false;
        this.canShootFromMain = true;
        this.baseMoveDelay = 10000;
        this.moveDelay = 7500;
        this.lastMoveTime = 1;
        this.movePositions = [{x:width/2, y:200}, {x:(width/2)-250, y:150}, {x:width/2, y:100}, {x:(width/2)+250, y:200}, {x:(width/2)-250, y:100}]//the positions the boss will switch between
        this.movePositionIndex = 0;
        this.totalMovesMade = 0;
        this.lastMoveHealth = 100000;
    }

    //when the boss starts it is positioned above the screen and then moved down
    //this function also enables the shooting
    enable(){ 
        console.log("Enabling the boss")
        this.x = width/2;
        this.y = -500;
        this.lastMoveHealth = this.health;
        this.canShoot = true;
        this.moveToPos(width/2, 150);
        this.healthBarBG.visible = true;
        this.healthBar.visible = true;
        this.isEnabled = true;
        //this is so I don't have to repeat the code in the arms
        //the bind makes sure it uses the variables from the boss instead of the arm
        this.left.mainHealthBarUpdate = this.healthBarUpdate.bind(this);
        this.right.mainHealthBarUpdate = this.healthBarUpdate.bind(this);
        this.maxHealth = this.health;
    }

    //When the boss is defeated it is cleaned up, like removing the bullets from all the guns and disabling the shooting
    disable(){
        console.log("Disabling the boss")
        this.gun.destroyBullets();
        this.left.gun.destroyBullets();
        this.right.gun.destroyBullets();
        this.canShoot = false;
        this.healthBarBG.visible = false;
        this.healthBar.visible = false;
        this.isEnabled = false;
    }

    //set is used to make sure the health doesn't go below 0
    set health_main(health){
        if(health >= 0){
            this.healthNum = health;
        }
        this.healthBarUpdate();
    }

    get health_main(){
        return this.healthNum;
    }

    //the health of the boss is the body plus the two arms
    get health(){
        return this.healthNum + this.left.health + this.right.health
    }

    //When moving the positions of the arms needs to be changed too
    //a set is best for this because I can pretend like it is just one action
    set x(x){
        this.sprite.x = x;
        this.left.sprite.x = x + this.left.offsetX;
        this.right.sprite.x = x + this.right.offsetX;
        this.xPos = x;
    }

    get x(){
        return this.xPos;
    }

    set y(y){
        this.sprite.y = y;
        this.left.sprite.y = y + this.left.offsetY;
        this.right.sprite.y = y + this.right.offsetY;
        this.yPos = y;
    }
    
    get y(){
        return this.yPos;
    }

    healthBarUpdate(){
        this.healthBar.width = (width/2)*(this.health/this.maxHealth)
    }

    update(){
        if(this.isEnabled == true){//only run if the boss is enabled

            if(this.canShoot == true){
                //check if the gun can shoot and wait for the delay to end
                if(this.left.canShoot == true && this.game.time.now - this.left.lastShootTime >= this.left.shootDelay){
                    this.left.gun.shoot(player.x, player.y);
                    this.left.lastShootTime = this.game.time.now;
                }
                if(this.right.canShoot == true && this.game.time.now - this.right.lastShootTime >= this.right.shootDelay){
                    this.right.gun.shoot(player.x, player.y);
                    this.right.lastShootTime = this.game.time.now;
                }

                //the main body of the boss uses a pulse show. it shoots 9 bullets in a spread
                if(this.canShootFromMain == true && this.game.time.now - this.lastShootTime >= this.shootDelay){
                    this.gun.pulse(9, "down");
                    this.lastShootTime = this.game.time.now;
                }

                
            }
        

            let leftHits = this.left.gun.checkHits([{name: "player", sprite: player.sprite}]);
            let mainHits = this.gun.checkHits([{name: "player", sprite: player.sprite}]);
            let rightHits = this.right.gun.checkHits([{name: "player", sprite: player.sprite}]);

            if(leftHits["player"] == true){
                player.health -= 1;
                console.log("Player hit by left arm")
            }
            if(mainHits["player"] == true){
                player.health -= 1;
                console.log("Player hit by main body")
            }
            if(rightHits["player"] == true){
                player.health -= 1;
                console.log("Player hit by right arm")
            }

            //move the boss if it has taken 20 damage, or it has been in he same place for too long
            if(this.game.time.now - this.lastMoveTime >= this.moveDelay || this.lastMoveHealth - this.health >= 20){
                this.lastMoveTime = this.game.time.now;
                this.totalMovesMade += 1;
                this.movePositionIndex = this.totalMovesMade % this.movePositions.length;
                this.moveDelay = this.baseMoveDelay * Math.random();
                this.lastMoveHealth = this.health;
                this.moveToPos(this.movePositions[this.movePositionIndex].x, this.movePositions[this.movePositionIndex].y);
            }

        }
    }


    moveToPos(x, y){
        //pause shooting while moving
        this.canShoot = false;
        //using a tween for this makes it much easier to move because I don't need to create any moving code in the update function
        this.game.tweens.add({
            targets: this,
            x: x,
            y, y,
            ease: 'cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1500,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: function(){this.canShoot = true;}.bind(this)//unpause shooting
        });
    }
}