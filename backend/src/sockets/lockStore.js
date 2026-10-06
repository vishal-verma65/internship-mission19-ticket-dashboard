const locks = new Map();

const lock = (ticketId, socketId) => {
  if (locks.has(ticketId)) return false;
  locks.set(ticketId, socketId);
  return true;
};

const unlock = (ticketId, socketId) => {
  if (locks.get(ticketId) !== socketId) return false;
  locks.delete(ticketId);
  return true;
};

const releaseAll = (socketId) => {
  const released = [];
  for (const [ticketId, owner] of locks) {
    if (owner === socketId) {
      locks.delete(ticketId);
      released.push(ticketId);
    }
  }
  return released;
};

const snapshot = () => Object.fromEntries(locks);

module.exports = { lock, unlock, releaseAll, snapshot };
