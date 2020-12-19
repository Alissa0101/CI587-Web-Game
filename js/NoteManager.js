class NoteManager{
    constructor(game, poolSize, particles){
        this.poolSize = poolSize;
        this.game = game;
        this.pool = []
        //this.createPool();
        this.timer = 0;
        this.startTime = 0;
        this.startedPlaying = false;
        this.currentNoteIndex = 0;
        this.song;
        this.nextHitNoteIndex = 0;
        this.emitter = particles.createEmitter();
        //this.setupEmitters();
        this.lane_left;
        this.lane_middle;
        this.lane_right;
        this.totalNotesPassed = 0;
        this.finished = false;
        }

    setupEmitters(){
        this.emitter.setPosition(-10000, 0);
        this.emitter.setSpeed(200);
        this.emitter.setBlendMode(Phaser.BlendModes.ADD);
        this.emitter.setLifespan(500);
        this.emitter.stop();
    }

    createPool(){
        for(let i = 0; i < this.poolSize; i++){
            this.pool.push(this.game.physics.add.image(0, -10000, 'note'));
        }
        
    }

    update(){
        if(this.startedPlaying == true && this.finished == false){
            this.timer = this.game.time.now - this.startTime;

            let nextNote = this.song.nextNote;
            if(nextNote != undefined){
                //console.log(this.timer, nextNote.spawnTime)
                if(this.timer >= nextNote.spawnTime){
                    //console.log(this.pool[0].y)
                    if(this.poolSize-1 == this.currentNoteIndex){
                        this.currentNoteIndex = 0;
                    }
                    this.pool[this.currentNoteIndex].x = nextNote.side;
                    this.pool[this.currentNoteIndex].y = 0;
                    this.pool[this.currentNoteIndex].setVelocity(0, this.song.speed);
                    this.currentNoteIndex += 1;
                    this.song.next();
                }
            }
            if(this.poolSize-1 == this.nextHitNoteIndex){
                this.nextHitNoteIndex = 0;
            }
            if(this.pool[this.nextHitNoteIndex].y >= height-150){
                
                //console.log("HIT", this.nextHitNoteIndex)
                //this.pool[this.nextHitNoteIndex].x = 0;
                let hit = checkOverlap(this.pool[this.nextHitNoteIndex], player.sprite);
                if(hit == true){
                    this.hitNote();
                }
                this.nextHitNoteIndex += 1;
                this.totalNotesPassed += 1;
                //console.log(this.totalNotesPassed , this.song.pattern.length)
            }
            if(this.totalNotesPassed == this.song.pattern.length){
                this.finished = true
            }
        }

        
    }

    playSong(song){
        console.log("Playing", song.name)
        this.startTime = this.game.time.now
        this.startedPlaying = true;
        this.song = song;
        song.play();
    }

    hitNote(){
        
        player.health += 1;
        this.emitter.explode(10, this.pool[this.nextHitNoteIndex].x, height -75);
        this.pool[this.nextHitNoteIndex].x = -10000;
    }
}