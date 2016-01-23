var Platformer = Platformer || {};
var Connection = Connection || {};

Platformer.OtherPlayer = function (game_state, position, properties, name) {
    "use strict";

    Platformer.Prefab.call(this, game_state, position, properties);
    this.name = name;
    console.log('Other Name');
    console.log(name);
    this.walking_speed = +properties.walking_speed;
    this.jumping_speed = +properties.jumping_speed;
    this.bouncing = +properties.bouncing;

    this.game_state.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    this.animations.add("walking", [0, 1, 2, 1], 6, true);

    this.frame = 3;

    this.anchor.setTo(0.5);
    console.log(Platformer['prefabs']);
};

Platformer.OtherPlayer.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.OtherPlayer.prototype.constructor = Platformer.OtherPlayer;

Platformer.OtherPlayer.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    /*console.log('Other Player Updating');
    console.log('Other Name :)');
    console.log(this.name);
    console.log(Platformer['ONLINE'][this.name].x);
    console.log(this.body.x);
    /*this.body.x = Platformer['ONLINE'][this.name].x;
    this.body.y = Platformer['ONLINE'][this.name].y;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    */
    //this.game_state.game.physics.arcade.moveToXY(this, Platformer['ONLINE'][this.name].x, Platformer['ONLINE'][this.name].y, 250);

};
