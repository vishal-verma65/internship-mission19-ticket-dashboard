const priorityStyles = {
  low: 'bg-emerald-500/20 text-emerald-300',
  medium: 'bg-amber-500/20 text-amber-300',
  high: 'bg-rose-500/20 text-rose-300',
};

export default function TicketCard({ ticket, lockOwner, mySocketId, onLock, onUnlock }) {
  const isLocked = Boolean(lockOwner);
  const isMine = isLocked && lockOwner === mySocketId;
  const offline = !mySocketId;

  const border = isMine
    ? 'border-indigo-500'
    : isLocked
    ? 'border-rose-500/60'
    : 'border-slate-800';

  return (
    <div className={`rounded-xl border ${border} bg-slate-900 p-4 transition`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-100">{ticket.title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs ${priorityStyles[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-400">{ticket.description || 'No description'}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {isMine ? 'Locked by you' : isLocked ? 'Locked by another agent' : 'Available'}
        </span>

        {isMine ? (
          <button
            onClick={() => onUnlock(ticket._id)}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
          >
            Unlock
          </button>
        ) : (
          <button
            onClick={() => onLock(ticket._id)}
            disabled={isLocked || offline}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
          >
            Lock
          </button>
        )}
      </div>
    </div>
  );
}
