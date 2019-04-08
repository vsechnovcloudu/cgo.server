//import Colyseus from "colyseus.js";
const PIXI = require('pixi.js');

var client = new Colyseus.Client('ws://localhost:2567');

var room = client.join("room_name");
room.onJoin.add(function() {
    console.log(client.id, "joined", room.name);
});

room.onStateChange.add(function(state) {
  console.log(room.name, "has new state:", state);
});

room.onMessage.add(function(message) {
  console.log(client.id, "received on", room.name, message);
});

room.onError.add(function() {
  console.log(client.id, "couldn't join", room.name);
});

room.onLeave.add(function() {
  console.log(client.id, "left", room.name);
});

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

PIXI.loader
    .add('textures/da.json')
    .load(onAssetsLoaded);

function onAssetsLoaded()
{



    let sheet = PIXI.loader.resources[ 'textures/da.json' ].spritesheet;
    let animSprite = new PIXI.extras.AnimatedSprite( sheet.animations['da']);


    // animSprite.x = app.screen.width / 2;
    // animSprite.y = app.screen.height / 2;
    animSprite.x = 0;
    animSprite.y = 0;
    animSprite.scale.x = 0.7;
    animSprite.scale.y = 0.7;




    //console.log(animSprite.height);


    //animSprite.anchor.set(0,0);
    animSprite.animationSpeed = 0.05;
    animSprite.play();



    let rect = new PIXI.Graphics;
    rect.lineStyle( 5, 0x4d71dd, 1, 0 ); // linewidth, color,aplha,alingment
    rect.beginFill( 0x4d71dd );
    rect.drawRect( 0, 0, animSprite.width, animSprite.height ); //x,y,width, height
    rect.endFill();


    app.stage.addChild( rect );
    app.stage.addChild( animSprite );



    // Animate the rotation
    app.ticker.add(function() {
        //anim.rotation += 0.01;
    });
}
