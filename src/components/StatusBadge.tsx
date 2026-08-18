interface StatusBadgeProps {
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const className =
    status === 'Scheduled'
      ? 'status-scheduled'
      : status === 'Completed'
      ? 'status-completed'
      : 'status-cancelled';

  return (
    <span className={className}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Scheduled'
            ? 'bg-purple-500'
            : status === 'Completed'
            ? 'bg-emerald-500'
            : 'bg-rose-500'
        }`}
      />
      {status}
    </span>
  );
}
