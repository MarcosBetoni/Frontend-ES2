import { isToday, parseISO } from 'date-fns';

interface MinutesSectionProps {
  minutes: string;
  meetingDate: string;
  onChange: (minutes: string) => void;
}

export function MinutesSection({ minutes, meetingDate, onChange }: MinutesSectionProps) {
  const isEditable = isToday(parseISO(meetingDate));

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ata da Reunião</h2>
        {!isEditable && (
          <span className="text-sm text-gray-500">
            Disponível para edição apenas no dia da reunião. 
          </span>
        )}
      </div>
      <textarea
        value={minutes}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditable}
        className={`w-full h-[400px] p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          !isEditable ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        placeholder={
          isEditable
            ? "Digite a ata da reunião aqui..."
            : "A ata só pode ser editada no dia da reunião."
        }
      />
    </section>
  );
}