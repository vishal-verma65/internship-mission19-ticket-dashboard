import TicketCard from './TicketCard';

export default function TicketList({ tickets, locks, mySocketId, onLock, onUnlock }) {
  if (!tickets.length) {
    return <p className="text-slate-500">No tickets found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          lockOwner={locks[ticket._id]}
          mySocketId={mySocketId}
          onLock={onLock}
          onUnlock={onUnlock}
        />
      ))}
    </div>
  );
}
