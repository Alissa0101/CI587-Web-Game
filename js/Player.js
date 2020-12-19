class Player{
    constructor(){
        this.game = game;
        this.sprite = undefined;
        this.text = undefined;
        this.healthNum = 0;
        this.movementType = "none";
        this.speed = 15;
        this.gun = undefined;
        this.shootDelay = 100;
        this.lastShootTime = 0;
        this.healthBar;
        this.healthBarBG;
        this.maxHealth = 0;
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

    get health(){
        return this.healthNum;
    }

    set health(health){
        if(health >= 0){
            this.healthNum = health;
        }
        this.text.text = this.health
        this.healthBar.width = (width/2)*(this.health/this.maxHealth)
    }

    disable(){
        this.gun.destroyBullets();
        this.canShoot = false;
        this.movementType = "none"
        this.healthBarBG.visible = true;
        this.healthBar.visible = true;
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

            let hits = this.gun.checkHits([{name: "main", sprite: boss.sprite}, {name: "left", sprite: boss.left.sprite}, {name: "right", sprite: boss.right.sprite}])
            //console.log(hits)
            if(hits["main"] == true){
                console.log("hit main")
                boss.health_main -= 1;
            }
            if(hits["left"] == true){
                console.log("hit left")
                boss.left.health -= 1;
            }
            if(hits["right"] == true){
                console.log("hit right")
                boss.right.health -= 1;
            }

        }
    }


    movePlayerTween(x, y=this.y, time=100, override=false){
        if(this.movementType == "lane" || override == true){
            if(x != this.x){
                this.game.tweens.add({
                    targets: this.sprite,
                    x: x,
                    y: y,
                    ease: 'Back',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: time,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                });
            }
        }
    }
}