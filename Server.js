const express = require('express')
const path = require('path');

class Server {
 activeSockets = [];
 activeRooms = {

 }
 DEFAULT_PORT = 5000;

 constructor() {
   this.initialize();
 
   this.handleRoutes();
   this.handleSocketConnection();
 }
 
 initialize() {
   this.app = express();
   this.httpServer = require('http').Server(this.app)
   this.io = require('socket.io')(this.httpServer)
   this.configureApp();
   this.handleSocketConnection();
 }
 
 handleRoutes() {
   this.app.get("/", (req, res) => {
     res.send(`<h1>Hello World</h1>`); 
   });
 }
 
 handleSocketConnection() {
   this.io.on("connection", socket => {
     console.log("Socket connected.");
     
      const existingSocket = this.activeSockets.find(
        existingSocket => existingSocket === socket.id
      );
      if (!existingSocket) {
        this.activeSockets.push(socket.id);
  
        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            existingSocket => existingSocket !== socket.id
          )
        });
        
        socket.broadcast.emit("update-user-list", {
          users: [socket.id]
        });
      }
      socket.on("create-room", data => {
        socket.broadcast.emit("refresh-rooms", {
          rooms: []
        });
      });
      socket.on("call-user", data => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id
        });
      });
      socket.on("make-answer", data => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer
        });
      });
      socket.on("reject-call", data => {
        socket.to(data.from).emit("call-rejected", {
          socket: socket.id
        });
      });

     socket.on("disconnect", () => {
      this.activeSockets = this.activeSockets.filter(
        existingSocket => existingSocket !== socket.id
      );
      socket.broadcast.emit("remove-user", {
        socketId: socket.id
      });
    });
   });
   
 }
 
 listen(port) {
   this.httpServer.listen(this.DEFAULT_PORT, () =>
     console.log(this.DEFAULT_PORT)
   );
 }

 configureApp() {
  this.app.use(express.static(path.join(__dirname, "./public")));
}
}

module.exports = Server;
