import { useState, useEffect } from "react";

interface ToastProps {
    message: string;
};

export default function Toast({
    message
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed top-5 left-0 right-0 mx-auto w-fit bg-bg-muted p-4 rounded-xl 
                        ${isVisible 
                            ? "translate-y-5 opacity-100"
                            : "translate-y-full opacity-0"
                        }
                        `}>
            <span>{message}</span>
        </div>
    );
}