const { Server } = require('socket.io');
const origins = require('../config/origins');
const registerTicketHandlers = require('./ticketHandlers');

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: origins },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  io.on('connection', (socket) => registerTicketHandlers(io, socket));

  return io;
};
