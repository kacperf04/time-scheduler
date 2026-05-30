"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardTabs from "@/components/structure/DashboardTabs";
import { User } from "@/types";
import DashboardTab from "@/components/structure/DashboardTab";
import DemandsTab from "@/components/structure/DemandsTab";
import EmployeesTab from "@/components/structure/EmployeesTab";
import GenerateScheduleTab from "@/components/structure/GenerateScheduleTab";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/me"); 
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user context", error);
                router.push("/login"); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-mono animate-pulse">Loading workspace...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col w-full">
            <DashboardTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                user={user} 
            />

            <main className="pt-28 px-6 mx-auto w-full grow flex flex-col">
                {activeTab === "dashboard" && <DashboardTab/>}
                {activeTab === "demands" && <DemandsTab/>}
                {activeTab === "employees" && <EmployeesTab/>}
                {activeTab === "generate-schedule" && <GenerateScheduleTab/>}
            </main>
        </div>
    );
}