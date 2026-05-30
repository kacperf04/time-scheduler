
interface InputGroupProps {
    label: string;
    id: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    value?: string;
    name?: string;
    required: boolean;
    autoComplete?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputGroup({
    label,
    id,
    type,
    placeholder,
    value,
    name,
    required,
    autoComplete,
    onChange,
}: InputGroupProps) {
    return (
        <div className="flex flex-col justify-center items-start w-full">
            <label htmlFor={id} className="text-sm">{label}</label>
            <input
              className="
              text-on-primary-container border-b-2 pt-2 text-lg w-full
              outline-none autofill:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.5)]"
              id={id}
              type={type}
              placeholder={placeholder}
              value={value}
              name={name}
              required={required}
              autoComplete={autoComplete}
              onChange={onChange}
            />
        </div>
    );
}