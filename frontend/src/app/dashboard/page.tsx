import Navbar from "@/components/Navbar";
import WeeklyCalendar from "@/components/weekly_calendar/WeeklyCalendar";

export default function Dashboard() {
    return (
        <main className="w-full h-full flex flex-col items-center justify-around gap-20 pb-20">
            <Navbar/>
            <WeeklyCalendar mode="edit" offset={0} hourLowerBound={8} hourUpperBound={20}/>
        </main>
    );
}