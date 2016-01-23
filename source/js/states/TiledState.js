var Phaser = Phaser || {};
var Platformer = Platformer || {};
var Connection = Connection || {};


Platformer.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.TiledState.prototype = Object.create(Phaser.State.prototype);
Platformer.TiledState.prototype.constructor = Platformer.TiledState;

Platformer.TiledState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    this.map.addTilesetImage(this.map.tilesets[0].name, level_data.map.tileset);
    Platformer.map = this.map;
    console.log(Platformer.map);
    console.log(this);
};

Platformer.TiledState.prototype.create = function () {
    "use strict";
    console.log("TiledState Created");
    var group_name, object_layer, collision_tiles;

    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();

    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);

    this.prefabs = {};

    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    Platformer.TiledState.prototype.getOnlinePlayers(this);
};

Platformer.TiledState.prototype.create_object = function (object) {
    "use strict";
    var position, prefab;
    // tiled coordinates starts in the bottom left corner

    position = {"x": object.x + (this.map.tileHeight / 2), "y": object.y - (this.map.tileHeight / 2)};
    // create object according to its type
    switch (object.type) {
    case "player":
        prefab = new Platformer.Player(this, position, object.properties);
        break;
    case "other_player":
        prefab = new Platformer.OtherPlayer(this, position, object.properties);
        break;
    case "ground_enemy":
        prefab = new Platformer.Enemy(this, position, object.properties);
        break;
    case "flying_enemy":
        prefab = new Platformer.FlyingEnemy(this, position, object.properties);
        break;
    case "goal":
        prefab = new Platformer.Goal(this, position, object.properties);
        break;
    }
    console.log("Object Name: " + object.name);
    this.prefabs[object.name] = prefab;
    Platformer['ONLINE'] = {};
};


Platformer.TiledState.prototype.create_server_objects = function (type, data, tilemap) {
    "use strict";
    var position, prefab;
    // tiled coordinates starts in the bottom left corner
    position = {"x": data.x + (tilemap.tileHeight / 2), "y": data.y - (tilemap.tileHeight / 2)};
    // create object according to its type
    /*"bouncing":"20",
    "group":"players",
    "jumping_speed":"500",
    "texture":"player_spritesheet",
    "walking_speed":"200"
    */
    var properties = {bouncing:"20",
    group:"players",
    jumping_speed:"500",
    texture:"player_spritesheet",
    walking_speed:"200"};
    console.log(this);
    prefab = new Platformer.OtherPlayer(tilemap, position, properties, data.name);
    tilemap.prefabs[data.name] = prefab;
};
Platformer.TiledState.prototype.getOnlinePlayers = function (tilemap) {
  console.log(tilemap);
  this.tilemap = tilemap;
  Connection['socket'].on('onPlayerConnect', function(data) {
    console.log(data);
    //we need to have a player connect...
    //To connect, a player will start their game, send notification to server, server notifies every other player
    //Clients create prefab for otherPlayer indexed by player name, when otherPlayer moves, server sends emission with player name,
    //other player object is called and updates players position
    console.log("This is shit");
    console.log(data)
    if(data.name != null) {
      Platformer.TiledState.prototype.create_server_objects("other_player", data, tilemap);
      var name = data.name;

      Connection['ONLINE'].push();
    }
  });
  Connection['socket'].on('onOtherPlayerMove', function(data) {
    //console.log(data)
    var name = data.name;
    var i = Connection['ONLINE'];
    console.log(i[name]);
    console.log(i[name]);
    //console.log(data.data.x);
    //Connection['ONLINE'][data.name].x = data.data.x;
    //Connection['ONLINE'][data.name].y= data.data.y;
    //console.log(Platformer['ONLINE'][data.name].x);
    ///do the dir later

  });
};




Platformer.TiledState.prototype.restart_level = function () {
    "use strict";
    console.log("RESTART THE LEVEL");
    this.game.state.restart(true, false, this.level_data);
};
