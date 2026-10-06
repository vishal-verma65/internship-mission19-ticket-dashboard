const store = require('./lockStore');

const reply = (ack, payload) => typeof ack === 'function' && ack(payload);

module.exports = (io, socket) => {
  const broadcast = () => io.emit('lock_state', store.snapshot());

  socket.on('join_dashboard', (ack) => {
    socket.emit('lock_state', store.snapshot());
    reply(ack, { ok: true });
  });

  socket.on('lock_ticket', (payload, ack) => {
    const ticketId = payload?.ticketId;
    if (typeof ticketId !== 'string' || !ticketId) {
      return reply(ack, { ok: false, error: 'Invalid ticketId' });
    }
    if (!store.lock(ticketId, socket.id)) {
      return reply(ack, { ok: false, error: 'Ticket already locked' });
    }
    broadcast();
    reply(ack, { ok: true });
  });

  socket.on('unlock_ticket', (payload, ack) => {
    const ticketId = payload?.ticketId;
    if (!store.unlock(ticketId, socket.id)) {
      return reply(ack, { ok: false, error: 'Not the lock owner' });
    }
    broadcast();
    reply(ack, { ok: true });
  });

  socket.on('disconnect', () => {
    const released = store.releaseAll(socket.id);
    if (released.length) broadcast();
  });
};
