"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import api from "@/lib/api";

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
        <main>
            {error && <div>{error}</div>}

            <form onSubmit={handleSubmit}>
            <div>
                <label>Full Name</label>
                <input
                type="text"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div>
                <label>Email</label>
                <input
                type="email"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>
            <div>
                <label>Password</label>
                <input
                type="password"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Register"}
            </button>
            </form>
        </main>
    )
}