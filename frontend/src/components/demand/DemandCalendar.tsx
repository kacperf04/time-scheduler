import { Demand } from "@/types";
import DemandDayCard from "./DemandDayCard";

interface DemandCalendarProps {
    demand: Demand | null;
    daysInMonth: Array<number>;
    year: number;
    month: number;
    isPosted: boolean | undefined;
}

export default function DemandCalendar({
    demand,
    daysInMonth,
    year,
    month,
    isPosted
}: DemandCalendarProps) {
    const dayOfWeek = new Date(year, month, 1).getDay();
    const blankDaysCount = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return (
        <div className="mx-auto px-22 py-4">
            <div className="grid grid-cols-7 text-center font-semibold text-lg text-gray-500 mb-2">
                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            <div className="grid grid-cols-7 border-gray-200">
                {Array.from({ length: blankDaysCount }).map((_, index) => (
                    <div key={`blank-${index}`} className="aspect-square" />
                ))}
                
                {daysInMonth.map(d => {
                    const existingSlot = demand?.slots.find(slot => parseInt(slot.date.split("-")[2]) === d);
                    
                    const dateStr = existingSlot?.date || `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const hasDemand = !!existingSlot;

                    return (
                        <div key={d} className="aspect-square p-2">
                            <DemandDayCard 
                                day={d} 
                                dateStr={dateStr}
                                demand={demand} 
                                hasDemand={hasDemand}
                                isPosted={isPosted}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}