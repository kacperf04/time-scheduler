
interface InputGroupProps {
    label: string;
    id: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    value?: string;
    required: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputGroup({
    label,
    id,
    type,
    placeholder,
    required,
    onChange,
}: InputGroupProps) {
    return (
        <div className="flex flex-col justify-center items-start w-full">
            <label htmlFor={id} className="text-text-heading">{label}</label>
            <input
              className="pt-2 border-b-2 focus:outline-0 focus:border-border-inverse transition-colors border-border-default w-full"
              id={id}
              type={type}
              placeholder={placeholder}
              required={required}
              onChange={onChange}
            />
        </div>
    );
}