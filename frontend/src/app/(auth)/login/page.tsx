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
            const formTarget = e.currentTarget;
            const domData = new FormData(formTarget);
        
            const rawEmail = domData.get("username") as string;
            const rawPassword = domData.get("password") as string;
            const formData = new URLSearchParams();
            formData.append("username", rawEmail);
            formData.append("password", rawPassword);

            await api.post("/auth/login", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

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

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col justify-center items-center gap-6 w-full">
          <InputGroup  
            label="Email"
            id="login-email"
            type="email"
            placeholder="user@example.com"
            value={email}
            name="username"
            required={true}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGroup  
            label="Password"
            id="login-pass"
            type="password"
            placeholder="Your strong password"
            value={password}
            name="password"
            required={true}
            autoComplete="password"
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