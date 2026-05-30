import { Demand } from "@/types";

interface DemandCalendarProps {
    demand: Demand,
    daysInMonth: number
};

export default function DemandCalendar(
    {
        demand,
        daysInMonth
    } : DemandCalendarProps
) {

    return (
        <div className="bg-on-tertiary-container">
            aa
        </div>
    )
}