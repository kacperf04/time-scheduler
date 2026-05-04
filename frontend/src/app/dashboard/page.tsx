"use client";

import Navbar from "@/components/Navbar";
import WeeklyCalendar from "@/components/weekly_calendar/WeeklyCalendar";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [availabilities, setAvailabilities] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    const btnClass = `py-2 w-36 bg-text-body rounded-lg text-text-inverse cursor-pointer`;

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await api.get("/availabilities/me");
                setAvailabilities(response.data);
            } catch (error) {
                console.error("Failed to fetch: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, []);

    const switchToPrevWeek = () => {
        setWeekOffset(weekOffset + 1);
    };

    const switchToNextWeek = () => {
        if (weekOffset == 0) return;

        setWeekOffset(weekOffset - 1);
    };

    if (loading) return <p>Loading your schedule...</p>;

    return (
        <main className="w-full h-full flex flex-col items-center justify-around gap-20 pb-20">
            <Navbar/>
            <div className="flex flex-col gap-5 items-center">
                <h1 className="text-3xl text-text-body font-bold">Your availabilities</h1>
                <div className="flex flex-row w-full px-8 justify-between">
                    <button className={btnClass} onClick={switchToPrevWeek}>Previous week</button>
                    <button className="text-text-body underline cursor-pointer" onClick={() => { setWeekOffset(0) }}>Reset</button>
                    <button disabled={weekOffset == 0} className={btnClass + `${weekOffset == 0 ? "cursor-default bg-text-disabled" : ""}`} onClick={switchToNextWeek}>Next week</button>
                </div>
                <WeeklyCalendar mode="view" offset={weekOffset} hourLowerBound={8} hourUpperBound={20} userAvailability={availabilities}/>
            </div>
        </main>
    );
}