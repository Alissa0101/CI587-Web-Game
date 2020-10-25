const width = 1000;
const height = 800;
const fps = 60;

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade'
     },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config);
let nm;
let song = new Song("TEMP SONG", 10000, 500);
song.createTempSong();

function preload ()
{
    //this.load.setBaseURL('localhost');//change later

    this.load.image('lane', 'assets/TEMP_Lane.png');
    this.load.image('note', 'assets/TEMP_Block.png');
    this.load.image('player', 'assets/TEMP_Player.png');
}

function create ()
{
    this.physics.world.setFPS(fps)
    

    this.lane_left = this.add.image((width/2)-250, 2500, 'lane');
    this.lane_middle = this.add.image(width/2, 2500, 'lane');
    this.lane_right = this.add.image((width/2)+250, 2500, 'lane');

    nm = new NoteManager(this, 50);

    nm.playSong(song);

    this.player = this.add.image(width/2, height - 75, 'player');

    this.input.keyboard.on('keydown_A', movePlayerLeft, this);//create A key listener for moving the player left
    this.input.keyboard.on('keydown_D', movePlayerRight, this);//create A key listener for moving the player right
}

function update(){
    //console.log(this.note.y)
    nm.update();
}


function movePlayerLeft(){
    if(this.player.x == width/2){
        this.player.x = (width/2)-250;
    } else if(this.player.x == (width/2)+250){
        this.player.x = width/2;
    }
}
function movePlayerRight(){
    if(this.player.x == (width/2)-250){
        this.player.x = width/2;
    } else if(this.player.x == width/2){
        this.player.x = (width/2)+250;
    }
}