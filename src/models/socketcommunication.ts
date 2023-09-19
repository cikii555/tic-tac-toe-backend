
let  io:any;

module.exports = {
  init: (server:any) => {
     io = require('socket.io')(server);
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