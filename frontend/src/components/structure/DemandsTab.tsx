import { ChevronLeft, ChevronRight } from "lucide-react";
import DemandCalendar from "../demand/DemandCalendar";
import { useState, useEffect } from "react";
import { 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    addMonths, 
    differenceInDays,
    format
} from 'date-fns';
import { Demand } from "@/types";
import api from "@/lib/api";
import { isAxiosError } from "axios"

function getMonthName(monthIndex: number, locale: string = 'en-US'): string {
    const date = new Date(2026, monthIndex, 1);
    
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
}

export default function DemandsTab() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentMonthString = getMonthName(currentMonth);
    const currentMonthLastDay = endOfMonth(today).getDate();
    const daysUntilDeadline = differenceInDays(endOfMonth(today), today);

    const [viewDate, setViewDate] = useState(today);
    const [processedDemand, setProcessedDemand] = useState<Demand | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const processedYear = viewDate.getFullYear();
    const processedMonthString = getMonthName(viewDate.getMonth());
    const daysInProcessedMonth = eachDayOfInterval({
        start: startOfMonth(viewDate),
        end: endOfMonth(viewDate)
    });
    const processedMonthDayNumbers = daysInProcessedMonth.map(date => date.getDate());

    useEffect(() => {
        const fetchDemandForMonth = async () => {
            setIsLoading(true);
            setError("");
            
            const startDateStr = format(startOfMonth(viewDate), 'yyyy-MM-dd');

            try {
                const response = await api.get(`/demands/date/${startDateStr}`);
                setProcessedDemand(response.data);
            } catch (err) {
                if (isAxiosError(err) && err.response?.status === 404) {
                    setProcessedDemand(null);
                } else {
                    console.error("Failed to fetch demand:", err);
                    setError("Failed to load demand data.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDemandForMonth();
    }, [viewDate]);

    const nextMonth = () => setViewDate(prevDate => addMonths(prevDate, 1));
    const prevMonth = () => setViewDate(prevDate => addMonths(prevDate, -1));


    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-mono">You can input or view staff demands here</h3>

            <div className="w-1/3 pl-4 bg-white/80 rounded-lg py-2">
                <span className={`border-l-5 pl-2 ${
                    daysUntilDeadline >= 15
                    ? "border-l-green-600"
                    : daysUntilDeadline >= 7
                    ? "border-l-yellow-600"
                    : "border-l-red-600"
                }`}>
                    Demand deadline for {getMonthName(today.getMonth() + 1)} is {currentMonthString} {currentMonthLastDay}. 
                    <span className={`pl-2 underline ${
                        daysUntilDeadline >= 15
                        ? "decoration-green-600"
                        : daysUntilDeadline >= 7
                        ? "decoration-yellow-600"
                        : "decoration-red-600"
                    }`}>
                        You have <span className="font-bold">{daysUntilDeadline}</span> {daysUntilDeadline == 1 ? "day" : "days"} left.
                    </span>
                </span>
            </div>

            <div className="flex flex-row gap-10">
                <div className="bg-white/80 w-3/4 p-5 rounded-md">
                    <div className="flex flex-row justify-between items-center px-5">
                        <button className="p-1 rounded-full hover:bg-secondary-container/30 transition-all cursor-pointer"
                                onClick={() => prevMonth()}
                        >
                            <ChevronLeft size={32}/>
                        </button>
                        <span className="text-xl font-mono">
                            {processedMonthString} {processedYear}
                        </span>
                        <button className="p-1 rounded-full hover:bg-secondary-container/30 transition-all cursor-pointer"
                                onClick={() => nextMonth()}
                        >
                            <ChevronRight size={32}/>
                        </button>
                    </div>

                    {
                        !isLoading && (
                            <DemandCalendar 
                                demand={processedDemand} 
                                daysInMonth={processedMonthDayNumbers} 
                                year={processedYear} 
                                month={viewDate.getMonth()}
                                isPosted={processedDemand?.is_posted}
                            />
                        )
                    }

                </div>

                <div className="bg-white/80 w-1/4 p-5 rounded-md max-h-48">
                </div>
            </div>


        </div>
    )
}