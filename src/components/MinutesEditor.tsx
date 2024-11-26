interface MinutesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MinutesEditor({ value, onChange }: MinutesEditorProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[200px] p-2 border-0 focus:ring-0 resize-y"
        placeholder="Digite a ata da reunião aqui..."
      />
    </div>
  );
}