import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {

    @type("string")
    id: string;

    @type("number")
    x: number;

    @type("number")
    y: number;

    @type("number")
    z: number;

    @type("number")
    rotation: number;

    @type("boolean")
    connected: boolean = true;
}

export class State extends Schema {

    @type({ map: Player })
    players = new MapSchema<Player>();

    createPlayer (id: string) {
        this.players[ id ] = new Player();
        this.players[ id ].x = 0;
        this.players[ id ].y = 0;
        this.players[ id ].z = 0;
        this.players[ id ].rotation = 0;
        this.players[ id ].id = id;

    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    movePlayer (id: string, data: any) {

        console.log("debug ", data);

        // if (data === "move_right") {
        //   this.state.players[client.sessionId].x += 0.01;
        // }

        // if ( data.x ) {
        //     this.players[ id ].x = data.x;
        //     console.log("Player moved x:" + data.x);
        //
        // } else if ( data.y ) {
        //     this.players[ id ].y = data.y;
        //     console.log("Player moved y:" + data.y);
        //
        // } else if ( data.z ) {
        //     this.players[ id ].z = data.z;
        //     console.log("Player moved z:" + data.z);
        // }
        if ( data.action == "move" )
        {
          this.players[ id ].x = data.x;
          this.players[ id ].y = data.y;
          this.players[ id ].z = data.z;
        }

        if ( data.action == "rotate" )
        {
          this.players[ id ].rotation = data.rotation;
        }

    }


}

export class MyRoom extends Room<State> {

      onInit (options: any) {
        console.log('room init');

        this.setState(new State());

        this.setSimulationInterval((deltaTime) => this.update(deltaTime));

      }

      onJoin (client: Client, options: any) {
        console.log('joined!');

        this.state.createPlayer(client.sessionId);

      }

      onMessage (client: Client, data: any) {

        console.log("Message from: ", client.sessionId, ":", data);
        this.state.movePlayer(client.sessionId, data);

      }

      onLeave (client: Client, consented: boolean) {
        console.log('left');

        this.state.removePlayer(client.sessionId);
      }

      onDispose() {
        console.log('disposed');
      }


      update (deltaTime) {

          // implement your physics or world updates here!
          // this is a good place to update the room state

      }

}
