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


var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render});
var leftStop = false;
var rightStop = false;
var platforms;
var player;
var floor;
  

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
    
    //floor = new Phaser.Rectangle(0, game.world.height - 54, 200, 50);
    
    
    
    // create the ground
    var ground = platforms.create(0, game.world.height - 95, floor);
    ground.scale.setTo(4, 1);
    ground.body.immovable = true;
    ground = platforms.create(160.5, game.world.height - 95, floor);
    ground.scale.setTo(1.05, 1);
    ground.body.immovable = true;
    ground = platforms.create(190.5, game.world.height - 128, floor);
    ground.scale.setTo(1.05, 1);
    ground.body.immovable = true;
    ground = platforms.create(0, game.world.height-0.1, floor);
    ground.scale.setTo(1920, 1);
    ground.body.immovable = true;
   
    
    
     // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 800;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    //  animations
    player.animations.add('left', [3, 4, 5], 10, true);
    player.animations.add('right', [6, 7, 8], 10, true);
    player.animations.add('left_jump', [12, 13, 14], 10, true);
    player.animations.add('right_jump', [15, 16, 17], 10, true);
}

function update(){
    
    getFromDatabase();
    selectController();    
    if(keyboard){
        keyboardContol();
    }    
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

function selectController(){
    mobileBtn.addEventListener("click", function(){
        refController.update(
                {
                    mobile: true,
                    keyboard: false
                }
            );
    });
    
    keyboardBtn.addEventListener("click", function(){
        refController.update(
                {
                    mobile: false,
                    keyboard: true
                }
            );
    });
}

function playerControl(){
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    
    if (right && !up)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        rightStop = true;
        leftStop = false;
        player.animations.play('right');
    }
    else if (left && !up)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        leftStop = true;
        rightStop = false;
        player.animations.play('left');
    }
    else if (up && right){
        player.body.velocity.x = 150;
        player.frame = 15; 
        rightStop = true;
        leftStop = false;
    }
    else if (up && left){
        player.body.velocity.x -= 150;
        player.frame = 13; 
        leftStop = true;
        rightStop = false;
    }
    else if (up && !right && !left){
        player.animations.stop();
        if(rightStop){
             player.frame = 16;    
        }
        else if(leftStop){
            player.frame = 13; 
        }
        else{
           player.frame = 16;  
        }
    }
    else if (!right && !left && !up)
    {
        //  Stand still
        player.animations.stop();
        if(rightStop){
             player.frame = 8;    
        }
        else if(leftStop){
            player.frame = 4; 
        }
        else{
           player.frame = 8;  
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

    
