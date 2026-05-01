"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAxiosError } from "axios";

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
        <main>
            {error && <div>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
        </main>
    );
}