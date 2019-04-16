import http from "http";
import { Server, RedisPresence } from "colyseus";
import { MyRoom } from "./MyRoom";

const port = Number(process.env.PORT || 3000);

const gameServer = new Server({
  server: http.createServer(),
  pingTimeout: 0 // 0 is for debugging
});

gameServer.register('game', MyRoom);

gameServer.listen(port);

gameServer.onShutdown(function () {
    console.log("master process is being shut down!");
});

console.log(`Listening on ws://localhost:${ port }`);
