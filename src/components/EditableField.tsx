import { cn } from '../lib/utils';

interface EditableFieldProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  label?: string;
  type?: 'text' | 'time';
  className?: string;
}

export function EditableField({
  value,
  isEditing,
  onChange,
  label,
  type = 'text',
  className,
}: EditableFieldProps) {
  if (isEditing) {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500',
            className
          )}
        />
      </div>
    );
  }

  return (
    <div>
      {label && (
        <span className="text-sm font-medium text-gray-500 mr-2">{label}:</span>
      )}
      <span className={className}>{value}</span>
    </div>
  );
}