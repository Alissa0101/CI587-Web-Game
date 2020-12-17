class Player{
    constructor(){
        this.game = game;
        this.sprite = undefined;
        this.scoreNum = 0;
        this.scoreText = undefined;
        this.livesNum = 0;
        this.movementType = "none";
        this.speed = 15;
        this.gun = undefined;
        this.shootDelay = 100;
        this.lastShootTime = 0;
    }

    get score(){
        return this.scoreNum;
    }

    set score(score){
        this.scoreNum = score
        this.scoreText.text = this.scoreNum
        //set is used to update the score text
    }

    get x(){
        return this.sprite.x;
    }

    set x(x){
        this.sprite.x = x;
    }

    get y(){
        return this.sprite.y;
    }

    set y(y){
        this.sprite.y = y;
    }

    get lives(){
        return this.livesNum;
    }

    set lives(lives){
        this.livesNum = lives;
        this.scoreText.text = this.livesNum
    }

    update(){
        if(this.movementType == "free"){
            if(key_W.isDown == true){
                if(this.y - this.speed > 35){
                    this.y -= this.speed;
                }
                
            }
            if(key_A.isDown == true){
                if(this.x - this.speed > 35){
                    this.x -= this.speed;
                }
            }
            if(key_S.isDown == true){
                if(this.y + this.speed < height-35){
                    this.y += this.speed;
                }
            }
            if(key_D.isDown == true){
                if(this.x + this.speed < width-35){
                    this.x += this.speed;
                }
            }
        }

        if(this.canShoot == true){
            if(key_SPACE.isDown == true){
                if(this.game.time.now - this.lastShootTime > this.shootDelay){
                    this.gun.shoot(this.x, 100);
                    this.lastShootTime = this.game.time.now;
                }
            }

            for(let i = 0; i < this.gun.bulletPoolSize; i++){
                let bullet = this.gun.bulletPool[i];
                let hit = false;
                if(checkOverlap(bullet, boss.sprite) == true){
                    boss.health_main -= 1;
                    hit = true;
                    console.log("Left: " + boss.left.health + " Main: " + boss.healthNum + " Right: " + boss.right.health + " Health: " + boss.health)
                }
                if(checkOverlap(bullet, boss.left.sprite) == true){
                    boss.left.health -= 1;
                    hit = true;
                    console.log("Left: " + boss.left.health + " Main: " + boss.healthNum + " Right: " + boss.right.health + " Health: " + boss.health)
                }
                if(checkOverlap(bullet, boss.right.sprite) == true){
                    boss.right.health -= 1;
                    hit = true;
                    console.log("Left: " + boss.left.health + " Main: " + boss.healthNum + " Right: " + boss.right.health + " Health: " + boss.health)
                }
                if(hit == true){
                    bullet.y = -1000;
                    bullet.setVelocity(0, 0);
                }
            }

        }
    }


    movePlayerTweenX(x){
        if(this.movementType == "lane"){
            if(x != this.x){
                this.game.tweens.add({
                    targets: this.sprite,
                    x: x,
                    ease: 'Back',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 100,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                });
            }
        }
    }
}