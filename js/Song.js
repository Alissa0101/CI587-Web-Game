class Song{
    constructor(game, name, filePath, speed){
        this.game = game;
        this.name = name;
        this.speed = speed;
        this.spawnDelay = ((height-150)/this.speed)*1000;
        this.buffer = 0; //delay the start
        this.filePath = filePath;
        this.pattern = []
        /**
         * 
         * The pattern contains all the info for each note
         * like when it hits the bottom,
         * when it needs to be spawned at the top and
         * left, middle or right
         * 
         * the format is 
         * {hitTime: int, spawnTime: int, side: float}
         * 
         * side is a float so I can store the X coord instead of storing a string and using else if or switch later
         * 
         */
        this.nextNoteIndex = 0;
        this.nextNote;
        this.finished = false;
        this.music;
        this.game.load.audio(this.name, this.filePath)
        
    }


    addNote(hitTime, side){
        let spawnTime = hitTime - this.spawnDelay;
        this.pattern.push({hitTime: hitTime, spawnTime: spawnTime, side: side});
    }

    next(){
        let nextNote = this.pattern[this.nextNoteIndex];
        this.nextNoteIndex += 1;
        this.nextNote = nextNote;
        if(nextNote == undefined){
            this.finished = true;
        }
        //console.log("next");
    }

    play(){
        this.music.play();
    }

    load(data){
        //console.log(data)
        this.music = this.game.sound.add(this.name, {volume: 0.25});
        for(let i = 0; i < data.length; i++){
            data[i].hitTime += this.buffer
            data[i].spawnTime = data[i].hitTime-this.spawnDelay;
        }
        this.pattern = data
        //console.log(this.pattern)
        this.next();
    }

}