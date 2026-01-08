interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id: string;
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  id,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-medium text-slate-400 uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 font-mono text-sm"
      />
    </div>
  );
}
