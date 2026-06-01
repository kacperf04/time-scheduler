import { DemandSlot, DemandSlotActionType } from "@/types";

import { SquarePen, Info } from "lucide-react";
import { useState } from "react";
import DemandActionCard from "./DemandActionCard";

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

            <div className="w-full bg-secondary-container/30 flex flex-row justify-center items-center py-1 gap-8">
                <button className="text-primary font-mono cursor-pointer p-2 rounded-full transition-colors"
                onClick={() => editDemand()}
                >
                    <SquarePen size={22} className=""/>
                </button>
                <button className="text-primary font-mono cursor-pointer p-2 rounded-full transition-colors"
                onClick={() => viewDemand()}
                >
                    <Info size={22} className=""/>
                </button>
            </div>

            {demandModalActive && (
                <DemandActionCard 
                    demand={demandSlot} 
                    onClose={() => setDemandModalActive(false)} 
                    actionType={demandModalActionType}
                />
            )}
        </div>
    )
}