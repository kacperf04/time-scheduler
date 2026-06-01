import { DemandSlot } from "@/types";

import { SquarePen, Info } from "lucide-react";

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
        <div className="bg-on-tertiary-container/10 rounded-lg mx-auto w-full h-full py-1 flex flex-col justify-between">
            
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

            <div className="flex flex-col items-start justify-center gap-2 pb-2 px-2 text-white text-sm">
                <button className="group flex h-8 max-w-[32px] cursor-pointer items-center justify-start overflow-hidden rounded-full bg-primary-container/40 p-2 transition-all duration-300 ease-in-out hover:max-w-[200px]">
                    <SquarePen size={16} className="shrink-0"/>
                    <span className="ml-2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Edit demand
                    </span>
                </button>
                <button className="group flex h-8 max-w-[32px] cursor-pointer items-center justify-start overflow-hidden rounded-full bg-primary-container/40 p-2 transition-all duration-300 ease-in-out hover:max-w-[200px]">
                    <Info size={16} className="shrink-0" />
                    <span className="ml-2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        View demand
                    </span>
                </button>
            </div>

        </div>
    )
}