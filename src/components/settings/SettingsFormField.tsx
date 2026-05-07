interface SettingsFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  description?: string;
}

export default function SettingsFormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  description,
}: SettingsFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-150 ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:border-primary'
        }`}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
