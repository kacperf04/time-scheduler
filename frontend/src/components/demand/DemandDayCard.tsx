import { DemandSlot } from "@/types";

interface DemandDayCardProps {
    day: number;
    demandSlot: DemandSlot | null;
    isPosted: boolean | undefined;
}

export default function DemandDayCard({
    day,
    demandSlot,
    isPosted
}: DemandDayCardProps) {

    return (
        <div className="bg-on-tertiary-container/10 rounded-lg mx-auto w-full h-full py-1">
            
            <div className="flex flex-row justify-between items-center px-2">
                <span className="text-lg font-mono">{day}</span>
                
                <div className={`w-8 h-4 rounded-full ${
                    isPosted && demandSlot 
                    ? "bg-green-400"
                    : !isPosted && demandSlot
                    ? "bg-blue-400"
                    : "bg-red-400"
                }`}>
                </div>
            </div>

        </div>
    )
}