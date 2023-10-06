
let  io:any;

module.exports = {
  init: (server:any) => {
     io = require('socket.io')(server,{
      cors: {
        origin: "http://localhost:3000",
        credentials: true
      }
     });
     server.listen(80)
    
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  }
};