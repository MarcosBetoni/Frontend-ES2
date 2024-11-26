interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{message}</p>
      </div>
    </div>
  );
}