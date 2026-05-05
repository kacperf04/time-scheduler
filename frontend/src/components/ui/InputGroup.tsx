
interface InputGroupProps {
    label: string;
    id: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    value?: string;
    name: string;
    required: boolean;
    autoComplete: string;
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
            <label htmlFor={id} className="text-text-heading">{label}</label>
            <input
              className="pt-2 border-b-2 focus:outline-0 focus:border-border-inverse transition-colors border-border-default w-full bg-transparent autofill:shadow-[inset_0_0_0_1000px_#f7f0e0]"
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