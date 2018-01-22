var defaultDatabase = firebase.database();

// variables for controler
var right;
var left;
var up;
var down;
var mobile;
var keyboard;
var mobileBtn = document.getElementById("mobile");
var keyboardBtn = document.getElementById("keyboard");
var refControl;
var refController;
var leftStop = false;
var rightStop = false;
var upStop = false;
var downStop = false;
var platforms;
var player;
var floor;


var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render});

  

function preload () {
    this.load.image('background', 'assets/bg001.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ice-platform', 'assets/ice-platform.png');
    this.load.spritesheet('dude', 'assets/player_spritesheet(1).png', 32, 32);

}

function create() {
    game.world.setBounds(0, 0, 1920, 640);
    // Using Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Background implementation
    game.add.sprite(0, 0, 'background');
    
    // platform group
    platforms = game.add.group();
    
    // enable physics for plattforms
    platforms.enableBody = true;

    
     // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    //  animations
    player.animations.add('left', [3, 4, 5], 10, true);
    player.animations.add('right', [6, 7, 8], 10, true);
    player.animations.add('up', [9, 10, 11], 10, true);
    player.animations.add('down', [0, 1, 2], 10, true);
}

function update(){
    
    getFromDatabase();
    keyboardContol();
    playerControl();
}

function render(){
    //game.debug.geom(floor, '#0fffff');
}

function keyboardContol(){
     var cursors = game.input.keyboard.createCursorKeys();
     if(cursors.right.isDown){
            refControl.update(
                {
                    right: true
                }
            );        
        }else if(cursors.right.isUp){
            refControl.update(
                {
                    right: false
                }
            );
        }

        if(cursors.left.isDown){
            refControl.update(
                {
                    left: true
                }
            );        
        }else if(cursors.left.isUp){
            refControl.update(
                {
                    left: false
                }
            );
        }
        if(cursors.up.isDown){
            refControl.update(
                {
                    up: true
                }
            );        
        }else if(cursors.up.isUp){
            refControl.update(
                {
                    up: false
                }
            );
        }        
        if(cursors.down.isDown){
            refControl.update(
                {
                    down: true
                }
            );        
        }else if(cursors.down.isUp){
            refControl.update(
                {
                    down: false
                }
            );
        }
}

function getFromDatabase(){
    // get data from datebase --> CONTROL
    refControl = defaultDatabase.ref("control");
    refControl.once("value").then(function(snapshot){
        left = snapshot.child("left").exportVal();
        right = snapshot.child("right").exportVal();
        up = snapshot.child("up").exportVal();
        down = snapshot.child("down").exportVal();
    });
    // get data from datebase --> CONTROLLER
    refController = defaultDatabase.ref("controller");
    refController.once("value").then(function(snapshot){
        mobile = snapshot.child("mobile").exportVal();
        keyboard = snapshot.child("keyboard").exportVal();
    });
}

function playerControl(){
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    
    if (right)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        rightStop = true;
        leftStop = false;
        upStop = false;
        downStop = false;
        player.animations.play('right');
    }
    else if (left)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        rightStop = false;
        leftStop = true;
        upStop = false;
        downStop = false;
        player.animations.play('left');
    }
    else if (up){
        player.body.velocity.y = -150;
        rightStop = false;
        leftStop = false;
        upStop = true;
        downStop = false;
        player.animations.play('up');
    }
    else if(down){
        player.body.velocity.y = 150;
        rightStop = false;
        leftStop = false;
        upStop = false;
        downStop = true;
        player.animations.play('down');
    }
    else
    {
        //  Stand still
        player.body.velocity.y = 0;
        player.body.velocity.x = 0;
        player.animations.stop();
        if(rightStop){
             player.frame = 7;
        }
        else if(leftStop){
            player.frame = 4;
        }
        if(upStop){
            player.frame = 10;
        }
        else if(downStop){
            player.frame = 1;
        }
    }
    
     //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms); 
    game.physics.arcade.collide(player, floor);  
    
    //  Allow the player to jump if they are touching the ground.
    if (up && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
}

    
