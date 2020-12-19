const width = 1000;//window.innerWidth;
const height = 800;//window.innerHeight;

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
let nm;                             //note manager
let song;                           //the song that will be played
let gs = new GameState();           //Game state
let player = new Player();          //the player
let boss = new Boss();              //the boss


let key_W;                          
let key_A;
let key_S;
let key_D;
let key_SPACE;

function preload ()
{
    //this.load.setBaseURL('localhost');//change later

    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#3498db");

    this.load.image('lane', 'assets/TEMP_Lane.png');
    this.load.image('note', 'assets/TEMP_Block.png');
    this.load.image('player', 'assets/TEMP_Player.png');
    this.load.image('spark', 'assets/TEMP_Spark.png');
    this.load.image('bullet', 'assets/TEMP_Bullet.png');
    this.load.image('boss', 'assets/TEMP_Boss.png');
    this.load.image('boss_left', 'assets/TEMP_Boss_Left.png');
    this.load.image('boss_right', 'assets/TEMP_Boss_Left.png');


    //song = new Song(this, "I Like To Move It", "assets/songs/i_like_to_move_it.mp3", 10000, 500);
    song = new Song(this, "test", "assets/songs/i_like_to_move_it.mp3", 1000);
    
}

function create ()
{
    player.game = this;
    boss.game = this;
    gs.game = this;
    //this.physics.world.setFPS(fps)
    song.load(I_Like_To_Move_It);
    //song.load(test_song);

    //particles for when a note is hit
    let particles = this.add.particles('spark');
    nm = new NoteManager(this, 50, particles);

    //the three lanes for the first part of the game
    nm.lane_left = this.add.image((width/2)-250, 2500, 'lane');
    nm.lane_middle = this.add.image(width/2, 2500, 'lane');
    nm.lane_right = this.add.image((width/2)+250, 2500, 'lane');

    nm.lane_left.visible = false;
    nm.lane_middle.visible = false;
    nm.lane_right.visible = false;
    nm.emitter.visible = false;

    //nm.playSong(song);

    //set up the player
    player.text = this.add.text(0, 0, player.health)

    player.sprite = this.add.image(width/2, height - 75, 'player');

    player.gun = new Gun(this, 50, player.sprite, 3);
    player.healthBarBG = this.add.rectangle(width/2, height-20, (width/2)+5, 30, 0x636E72)
    player.healthBar = this.add.rectangle(width/2, height-20, width/2, 25, 0x00b16a)
    player.healthBarBG.visible = false;
    player.healthBar.visible = false;

    //setup the boss
    boss.sprite = this.physics.add.image(width/2, -1000, 'boss');
    boss.left.sprite = this.physics.add.image(width/2, -1000, 'boss_left');
    boss.right.sprite = this.physics.add.image(width/2, -1000, 'boss_right');

    boss.gun = new Gun(this, 50, boss.sprite, 1);
    boss.left.gun = new Gun(this, 25, boss.left.sprite, 1);
    boss.right.gun = new Gun(this, 25, boss.right.sprite, 1);

    boss.healthBarBG = this.add.rectangle(width/2, 25, (width/2)+5, 30, 0x636E72)
    boss.healthBar = this.add.rectangle(width/2, 25, width/2, 25, 0xf03434)
    boss.healthBarBG.visible = false;
    boss.healthBar.visible = false;


    //setup keyboard inputs
    this.input.keyboard.on('keydown_A', function(){player.movePlayerTween((width/2)-250);}, this);//create A key listener for moving the player to the left
    this.input.keyboard.on('keydown_S', function(){player.movePlayerTween(width/2);}, this);//create A key listener for moving the player to the middle
    this.input.keyboard.on('keydown_D', function(){player.movePlayerTween((width/2)+250);}, this);//create A key listener for moving the player to the right

    key_W = this.input.keyboard.addKey("W");
    key_A = this.input.keyboard.addKey("A");
    key_S = this.input.keyboard.addKey("S");
    key_D = this.input.keyboard.addKey("D");
    key_SPACE = this.input.keyboard.addKey("SPACE");

    //this.input.keyboard.

}

function update(){
    player.update();//run the update for the player
    boss.update();//run the update for the boss
    nm.update();//run the update for the note manager
    gs.checkState();//run the update for the game state
}

//check if two sprites are overlapping
// only works foor rectangles
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);

}

