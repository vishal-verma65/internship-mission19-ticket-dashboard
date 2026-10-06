import { useCallback, useEffect, useState } from 'react';
import socket from '../lib/socket';

export default function useTicketLocks() {
  const [locks, setLocks] = useState({});
  const [mySocketId, setMySocketId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const onConnect = () => {
      setMySocketId(socket.id);
      socket.emit('join_dashboard');
    };
    const onDisconnect = () => setMySocketId(null);
    const onLockState = (state) => setLocks(state);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('lock_state', onLockState);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('lock_state', onLockState);
      socket.disconnect();
    };
  }, []);

  const request = useCallback((event, ticketId) => {
    socket.emit(event, { ticketId }, (res) => {
      setError(res?.ok ? '' : res?.error || 'Request failed');
    });
  }, []);

  const lockTicket = useCallback((id) => request('lock_ticket', id), [request]);
  const unlockTicket = useCallback((id) => request('unlock_ticket', id), [request]);

  return { locks, mySocketId, error, lockTicket, unlockTicket };
}
