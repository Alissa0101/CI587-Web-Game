const width = 1000;
const height = 800;

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
let song;
let player;


function preload ()
{
    //this.load.setBaseURL('localhost');//change later

    this.load.image('lane', 'assets/TEMP_Lane.png');
    this.load.image('note', 'assets/TEMP_Block.png');
    this.load.image('player', 'assets/TEMP_Player.png');

    song = new Song(this, "I Like To Move It", "assets/songs/i_like_to_move_it.mp3", 10000, 500);
    
}

function create ()
{
    //this.physics.world.setFPS(fps)
    //this.sound.add(song.name)
    //song.createTempSong();
    song.load(I_Like_To_Move_It);

    this.lane_left = this.add.image((width/2)-250, 2500, 'lane');
    this.lane_middle = this.add.image(width/2, 2500, 'lane');
    this.lane_right = this.add.image((width/2)+250, 2500, 'lane');

    nm = new NoteManager(this, 50);

    nm.playSong(song);

    player = this.add.image(width/2, height - 75, 'player');

    this.input.keyboard.on('keydown_A', movePlayerLeft, this);//create A key listener for moving the player left
    this.input.keyboard.on('keydown_D', movePlayerRight, this);//create A key listener for moving the player right
}

function update(){
    //console.log(this.note.y)
    nm.update();
}


function movePlayerLeft(){
    let x = (width/2)-250;
    
    
    if(player.x == width/2){
        x = (width/2)-250;
    } else if(player.x == (width/2)+250){
        x = width/2;
    }

    let tween = this.tweens.add({
        targets: player,
        x: x,
        ease: 'Back',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 200,
        repeat: 0,            // -1: infinity
        yoyo: false
    });
}
function movePlayerRight(){
    let x = (width/2)+250;


    if(player.x == (width/2)-250){
        x = width/2;
    } else if(player.x == width/2){
        x = (width/2)+250;
    }

    let tween = this.tweens.add({
        targets: player,
        x: x,
        ease: 'Back',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 200,
        repeat: 0,            // -1: infinity
        yoyo: false
    });
}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);

}