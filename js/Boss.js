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
    }

    set health(health){
        if(health >= 0){
            this.healthNum = health;
        }
    }

    get health(){
        return this.healthNum;
    }

    disable(){
        this.canShoot = false;
        this.gun.destroyBullets();
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
        this.healthNum = 100;//heath of the boss's body

        this.left = new BossArm(-175, 0);
        this.right = new BossArm(175, 0);

        this.shootDelay = 3000;
        this.lastShootTime = 0;

        this.gun = undefined;
        this.canShoot = false;
        this.canShootFromMain = true;
        this.baseMoveDelay = 10000;
        this.moveDelay = 5000;
        this.lastMoveTime = 1;
        this.movePositions = [{x:250, y:150}, {x:width/2, y:200}, {x:width-250, y:150}, {x:width/2, y:100}]//the positions the boss will switch between
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
        this.isEnabled = true;
    }

    //When the boss is defeated it is cleaned up, like removing the bullets from all the guns and disabling the shooting
    //it also moves below the screen
    disable(){
        console.log("Disabling the boss")
        this.moveToPos(this.x, height+500);
        this.gun.destroyBullets();
        this.left.gun.destroyBullets();
        this.right.gun.destroyBullets();
        this.canShoot = false;
        this.isEnabled = false;
    }

    //set is used to make sure the health doesn't go below 0
    set health_main(health){
        if(health >= 0){
            this.healthNum = health;
        }
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


    update(){
        if(this.isEnabled == true){//only run if the boss is enabled

            if(this.canShoot == true){
                //check if the gun can shoot and wait for the delay to end
                if(this.left.canShoot == true && this.game.time.now - this.left.lastShootTime >= this.left.shootDelay){
                    this.left.gun.shoot(player.sprite.x, player.sprite.y);
                    this.left.lastShootTime = this.game.time.now;
                }
                if(this.right.canShoot == true && this.game.time.now - this.right.lastShootTime >= this.right.shootDelay){
                    this.right.gun.shoot(player.sprite.x, player.sprite.y);
                    this.right.lastShootTime = this.game.time.now;
                }
                //this.gun.shoot(player.sprite.x, player.sprite.y);
                //this.gun.pulse("up");

                //the main body of the boss uses a pulse show. it shoots 9 bullets in a spread
                if(this.canShootFromMain == true && this.game.time.now - this.lastShootTime >= this.shootDelay){
                    this.gun.pulse(9, "down");
                    this.lastShootTime = this.game.time.now;
                }

                
            }
        
            

            //move the boss if it has taken 15 damage, or it has been in he same place for too long
            if(this.game.time.now - this.lastMoveTime >= this.moveDelay || this.lastMoveHealth - this.health >= 15){
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
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: function(){this.canShoot = true;}.bind(this)//unpause shooting
        });
    }
}