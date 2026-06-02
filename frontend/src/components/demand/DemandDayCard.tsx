import { Demand, DemandSlotActionType } from "@/types";
import { SquarePen, Info } from "lucide-react";
import { useState } from "react";
import DemandActionCard from "./demandAction/DemandActionCard";

interface DemandDayCardProps {
    day: number;
    dateStr: string;
    demand: Demand | null;
    hasDemand: boolean;
    isPosted: boolean | undefined;
}

export default function DemandDayCard({
    day,
    dateStr,
    demand,
    hasDemand,
    isPosted
}: DemandDayCardProps) {
    const [demandModalActive, setDemandModalActive] = useState(false);
    const [demandModalActionType, setDemandModalActionType] = useState<DemandSlotActionType | null>(null);

    const editDemand = () => {
        setDemandModalActive(true);
        setDemandModalActionType(DemandSlotActionType.EDIT);
    }

    const viewDemand = () => {
        setDemandModalActive(true);
        setDemandModalActionType(DemandSlotActionType.VIEW);
    }

    return (
        <div className="bg-on-tertiary-container/10 rounded-lg mx-auto w-full h-full pt-1 flex flex-col justify-between overflow-hidden">
            <div className="flex flex-row justify-between items-center px-2">
                <span className="text-xl font-mono">{day}</span>
                <div className={`w-8 h-4 rounded-full ${
                    isPosted && hasDemand 
                    ? "bg-green-400"
                    : !isPosted && hasDemand
                    ? "bg-blue-400"
                    : "bg-red-400"
                }`}>
                </div>
            </div>

            <div className="w-12 bg-secondary-container/30 flex flex-row justify-center items-center py-1 gap-8 rounded-tr-lg">
                <button 
                    className="text-primary font-mono cursor-pointer p-2 rounded-full transition-colors"
                    onClick={() => editDemand()}
                >
                    <SquarePen size={22} />
                </button>
            </div>

            {demandModalActive && (
                <DemandActionCard 
                    demand={demand} 
                    selectedDate={dateStr}
                    onClose={() => setDemandModalActive(false)} 
                    actionType={demandModalActionType}
                />
            )}
        </div>
    );
}