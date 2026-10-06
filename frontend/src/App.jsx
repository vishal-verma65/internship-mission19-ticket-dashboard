import { useEffect, useState } from 'react';
import TicketList from './components/TicketList';
import useTicketLocks from './hooks/useTicketLocks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const { locks, mySocketId, error, lockTicket, unlockTicket } = useTicketLocks();

  useEffect(() => {
    fetch(`${API_URL}/api/tickets`)
      .then((res) => res.json())
      .then(setTickets)
      .catch(() => setTickets([]));
  }, []);

  return (
    <div className="min-h-screen p-6 text-slate-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ticket Dashboard</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs ${
              mySocketId ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {mySocketId ? 'Connected' : 'Disconnected'}
          </span>
        </header>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <TicketList
          tickets={tickets}
          locks={locks}
          mySocketId={mySocketId}
          onLock={lockTicket}
          onUnlock={unlockTicket}
        />
      </div>
    </div>
  );
}
