import { Member } from '../types/meeting';

interface AttendanceTrackerProps {
  attendees: Member[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function AttendanceTracker({
  attendees,
  selectedIds,
  onChange,
}: AttendanceTrackerProps) {
  const handleToggleAttendee = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    onChange(newSelectedIds);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {attendees.map(attendee => (
        <label
          key={attendee.id}
          className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(attendee.id)}
            onChange={() => handleToggleAttendee(attendee.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
            <p className="text-sm text-gray-500">{attendee.email}</p>
          </div>
        </label>
      ))}
    </div>
  );
}