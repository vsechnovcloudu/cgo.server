//import Colyseus from "colyseus.js";
const PIXI = require('pixi.js');


const app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

PIXI.loader
    .add('drokk', 'textures/da.json')
    .add('character', 'textures/character.png')
    .load( (loader, resources) => {
      onAssetsLoaded( resources )
    } );

let character = [];

function onAssetsLoaded( resources )
{

    let drokk = new PIXI.extras.AnimatedSprite( resources.drokk.spritesheet.animations['da']);
    drokk.x = 0;
    drokk.y = 0;
    drokk.scale.x = 0.7;
    drokk.scale.y = 0.7;
    drokk.animationSpeed = 0.05;
    drokk.play();

    //let texture = resources.character.texture;
    //let characterSprite = new PIXI.Sprite.fromImage( texture );


    // animSprite.x = app.screen.width / 2;
    // animSprite.y = app.screen.height / 2;
    //console.log(animSprite.height);
    //animSprite.anchor.set(0,0);


    let rect = new PIXI.Graphics;
    rect.lineStyle( 5, 0x4d71dd, 1, 0 ); // linewidth, color,aplha,alingment
    rect.beginFill( 0x4d71dd );
    rect.drawRect( 0, 0, drokk.width, drokk.height ); //x,y,width, height
    rect.endFill();


    app.stage.addChild( rect );
    app.stage.addChild( drokk );

    // Connect to SERVER
    var host = window.document.location.host.replace(/:.*/, '');

    let client = new Colyseus.Client("ws://localhost:3000");

    client.getAvailableRooms("game", function(rooms, err) {
      if (err) console.error(err);
      rooms.forEach(function(room) {
        console.log(room.roomId);
        console.log(room.clients);
        console.log(room.maxClients);
        console.log(room.metadata);
      });
    });

    // Join ROOM
    var room = client.join("game");


    room.onJoin.add(function() {
      // listen to patches coming from the server
      console.log("client joined successfully");

      room.state.players.onAdd = function(player, sessionId) {

        console.log(`player: ${sessionId} added`);

        character[sessionId] = new PIXI.Sprite.fromImage('textures/character.png');

        character[sessionId].x = player.x;
        character[sessionId].y = player.y;

        app.stage.addChild( character[sessionId] );

      }

      // room.state.players.onRemove = function(player, sessionId) {
      //   document.body.removeChild(players[sessionId]);
      //   delete players[sessionId];
      // }

      room.state.players.onChange = function (player, sessionId) {

        console.log(`x: ${player.x} y: ${player.y}`);
        character[sessionId].x = player.x;
        character[sessionId].y = player.y;

      }
    });

    room.onStateChange.add(function(state) {
      console.log("the room state has been updated:", state);
    });

    room.onError.add(function(err) {
      console.log("oops, error ocurred:");
      console.log(err);
    });

    window.addEventListener("keydown", function (e) {
      console.log(`key: ${e.which}`);
      if (e.which === 38) {
        room.send({ y: -1 });

      } else if (e.which === 39) {
        room.send({ x: 1 });

      } else if (e.which === 40) {
        room.send({ y: 1 })

      } else if (e.which === 37) {
        room.send({ x: -1 })
      }


    });



    // Animate the rotation
    app.ticker.add(function() {
        //anim.rotation += 0.01;
    });
}
