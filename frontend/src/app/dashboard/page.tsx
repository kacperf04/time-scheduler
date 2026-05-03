import Navbar from "@/components/Navbar";
import WeeklyCalendar from "@/components/weekly_calendar/WeeklyCalendar";

export default function Dashboard() {
    return (
        <main className="w-full h-full flex flex-col items-center justify-around gap-20">
            <Navbar/>
            <WeeklyCalendar mode="view" offset={0} hourLowerBound={8} hourUpperBound={23}/>
        </main>
    );
}