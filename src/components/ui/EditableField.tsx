import { cn } from '../../lib/utils';

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
            'px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            className
          )}
        />
      </div>
    );
  }

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-gray-700 mb-1">
          {label}:
        </span>
      )}
      <div className={cn('px-3 py-2', className)}>{value}</div>
    </div>
  );
}