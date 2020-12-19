class Gun{
    constructor(game, poolSize, pSprite, speed){
        this.game = game;
        this.parentSprite = pSprite
        this.bulletPool = [];
        this.bulletPoolSize = poolSize;
        this.bulletIndex = 0;
        this.totalShots = 0;
        this.bulletSpeed = speed;

        this.createBulletPool();
    }

    //create the pool of bullets the gun will use
    createBulletPool(){
        for(let i = 0; i < this.bulletPoolSize; i++){
            this.bulletPool.push(this.game.physics.add.image(0, -1000, 'bullet'));
        }
        console.log("created bullet pool");
    }

    //remove all the bullets to help performance
    //this isn't really needed, but it could be usefill if there are thousands of bullets 
    destroyBullets(){
        for(let i = 0; i < this.bulletPoolSize; i++){
            this.bulletPool[i].destroy();
        }
    }

    //Shoot a single bullet at a target
    shoot(x, y){
        let dirX = this.parentSprite.x - x
        let dirY = this.parentSprite.y - y
        let bullet = this.bulletPool[this.bulletIndex]
        bullet.x = this.parentSprite.x;
        bullet.y = this.parentSprite.y;
        bullet.setVelocity(dirX*-this.bulletSpeed, dirY*-this.bulletSpeed);
        this.totalShots += 1;
        this.bulletIndex = this.totalShots % this.bulletPoolSize;
    }

    //shoot an amount of bullets at the same time in a spread in a direction
    //dir is an int. 1 means shoot down, -1 means shot up
    pulse(amount, dir){
        let diff = 1000/(amount-1)
        if(dir == "down"){
            
            for(let i = 0; i < amount; i ++){
                let x = (-500+diff*i);
                let y = 500-Math.abs(x);
                this.shoot(this.parentSprite.x + x, this.parentSprite.y + y);
            }

        } else if(dir == "up"){
            for(let i = 0; i < amount; i ++){
                let x = (-500+diff*i);
                let y = 500-Math.abs(x);
                this.shoot(this.parentSprite.x + x, this.parentSprite.y - y);
            }
        }
        
    }

    checkHits(targets){
        let result = {}
        for(let i = 0; i < this.bulletPoolSize; i++){
            let bullet = this.bulletPool[i];
            for(let j = 0; j < targets.length; j++){
                let target = targets[j];
                if(checkOverlap(bullet, target.sprite) == true){
                    //if hit then hide the bullet
                    bullet.y = -1000;
                    bullet.setVelocity(0, 0);
                    result[target.name] = true;
                }
            }
            
        }
        return result;
    }

}