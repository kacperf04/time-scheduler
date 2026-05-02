"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAxiosError } from "axios";

import InputGroup from "@/components/ui/InputGroup";
import Toast from "@/components/ui/Toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await api.post("/auth/login", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            localStorage.setItem("token", response.data.access_token);

            router.push("/dashboard");
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.detail || "Invalid email or password.");
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
            label="Email"
            id="login-email"
            type="email"
            placeholder="user@example.com"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGroup  
            label="Password"
            id="login-pass"
            type="password"
            placeholder="Your strong password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-bg-subtle text-text-body py-1 px-8 border-2 border-transparent cursor-pointer active:scale-90 transition-transform"
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </>
    );
}