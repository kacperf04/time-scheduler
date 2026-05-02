"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import api from "@/lib/api";

import InputGroup from "@/components/ui/InputGroup";
import Toast from "@/components/ui/Toast";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await api.post("/auth/register", formData);
            router.push("/login");
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.detail || "Registration failed. Try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && <Toast message={error}/>}

            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-6 w-full">
                <InputGroup  
                    label="Full Name"
                    id="register-full-name"
                    type="text"
                    placeholder="John Doe"
                    required={true}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <InputGroup  
                    label="Email"
                    id="register-email"
                    type="email"
                    placeholder="user@example.com"
                    required={true}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <InputGroup  
                    label="Password"
                    id="register-password"
                    type="password"
                    placeholder="Your strong password"
                    required={true}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg bg-bg-subtle text-text-body py-1 px-8 border-2 border-transparent cursor-pointer active:scale-90 transition-transform"
                >
                    {isLoading ? "Loading..." : "Register"}
                </button>
            </form>
        </>
    )
}