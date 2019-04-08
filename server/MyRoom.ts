import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("number")
    x: number;

    @type("number")
    y: number;
}

export class State extends Schema {

    @type({ map: Player })
    players = new MapSchema<Player>();

    createPlayer (id: string) {
        this.players[ id ] = new Player();
        this.players[ id ].x = 1;
        this.players[ id ].y = 1;

    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    movePlayer (id: string, movement: any) {

        console.log("debug ", movement);
        if (movement.x) {
            this.players[ id ].x += movement.x * 10;

        } else if (movement.y) {
            this.players[ id ].y += movement.y * 10;
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
        console.log("StateHandlerRoom received message from", client.sessionId, ":", data);

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
