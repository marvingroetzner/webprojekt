Game.MainMenu = function(game){

};

Game.MainMenu.prototype = {
    create:function(game){
        this.createButton(game, "Play", game.world.centerX, game.world.centerY + 32, 300, 100, function(){
            this.state.start('Level1')
        });

        this.createButton(game, "About", game.world.centerX, game.world.centerY + 192, 300, 100, function(){
            this.state.start('About')
        });

        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'titlescreen');
        titlescreen.anchor.setTo(0.5, 0.5);
    },

    update:function(game){

    },

    createButton:function(game, string, x, y, w, h, callback){
        var btn1 = game.add.button(x, y, 'button', callback, this, 2, 1, 0);

        btn1.anchor.setTo(0.5, 0.5);
        btn1.width = w;
        btn1.height = h;

        var txt = game.add.text(btn1.x, btn1.y, string, {
            font: "14px Arial",
            fill: "#fff",
            align: "center"
        });
    }
}