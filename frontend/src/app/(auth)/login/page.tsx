"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import AuthContainer from "@/components/auth/AuthContainer";
import InputGroup from "@/components/auth/InputGroup";


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
      <AuthContainer type="login">
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col justify-center items-center gap-8 w-full">
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
            className="bg-primary-container px-14 py-2 text-white rounded-md mt-8 cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </AuthContainer>
    );
}