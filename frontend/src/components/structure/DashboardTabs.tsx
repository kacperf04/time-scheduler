'use client';

import { User } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

const COMMON_TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-availability', label: 'My Availability' },
    { id: 'schedules', label: 'My Schedules' },
];

const ADMIN_TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'demands', label: 'Demands' },
    { id: 'employees', label: 'Employees' },
    { id: 'generate-schedule', label: 'Generate Schedule' },
];

interface DashboardTabsProps {
    activeTab: string,
    setActiveTab: Dispatch<SetStateAction<string>>,
    user: User | null
};

export default function DashboardTabs({
    activeTab,
    setActiveTab,
    user
}: DashboardTabsProps) {
    const visibleTabs = user?.is_admin 
        ? ADMIN_TABS 
        : COMMON_TABS;

    return (
        <div className="fixed top-4 left-0 w-full px-6 flex flex-row justify-between items-center z-50">
            
            <nav className="bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
                <ul className="flex flex-row gap-1 text-sm font-medium">
                    
                    {visibleTabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        
                        return (
                            <li key={tab.id} className="relative">
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-white' 
                                            : 'text-gray-600 hover:bg-primary/10'
                                    }`}
                                >
                                    {tab.label}
                                </button>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-tab-indicator"
                                        className="absolute inset-0 bg-primary shadow-md rounded-full"
                                        transition={{ 
                                            type: "spring", 
                                            bounce: 0.2, 
                                            duration: 0.5 
                                        }}
                                    />
                                )}
                            </li>
                        );
                    })}

                </ul>
            </nav>

            <p className="text-xl font-mono">TimeScheduler</p>

        </div>
    );
}