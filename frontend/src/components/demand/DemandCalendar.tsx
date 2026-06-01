import { Demand, DemandSlot } from "@/types";

import DemandDayCard from "./DemandDayCard";

interface DemandCalendarProps {
    demand: Demand | null;
    daysInMonth: Array<number>;
    year: number;
    month: number;
    isPosted: boolean | undefined;
};

export default function DemandCalendar(
    {
        demand,
        daysInMonth,
        year,
        month,
        isPosted
    } : DemandCalendarProps
) {
    const demandDictionary = demand && daysInMonth.reduce((accumulator, day) => {
        const matchingSlot = demand.slots.find(slot => {
            const slotDay = parseInt(slot.date.split("-")[2]);
            return slotDay === day;
        });

        accumulator[day] = matchingSlot || null;
    
        return accumulator;
    }, {} as Record<number, DemandSlot | null>);

    const dayOfWeek = new Date(year, month, 1).getDay();
    const blankDaysCount = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return (
        <div className="mx-auto px-22 py-4">
            <div className="grid grid-cols-7 text-center font-semibold text-lg text-gray-500 mb-2">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
            </div>

            <div className="grid grid-cols-7 border-gray-200">
                {Array.from({ length: blankDaysCount }).map((_, index) => (
                    <div 
                        key={`blank-${index}`} 
                        className="aspect-square" 
                    />
                ))}

                {daysInMonth.map(d => (
                    <div key={d} className="aspect-square p-1">
                        <DemandDayCard day={d} demandSlot={demandDictionary ? demandDictionary[d] : null} isPosted={isPosted}/>
                    </div>
                ))}
            </div>
        </div>
    )
}