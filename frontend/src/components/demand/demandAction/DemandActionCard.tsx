import { useEffect } from "react";
import { Demand, DemandSlotActionType } from "@/types";
import { X } from "lucide-react";
import DemandActionTimeLine from "./DemandActionTimeline";

interface DemandActionCardProps {
    demand: Demand | null;
    selectedDate: string;
    onClose: () => void;
    actionType: DemandSlotActionType | null;
}

export default function DemandActionCard({
    demand,
    selectedDate,
    onClose,
    actionType
}: DemandActionCardProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    
    return (
        <div 
            className="fixed inset-0 w-screen h-screen bg-black/40 z-999 flex flex-col justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-white min-w-3/4 flex flex-col items-end gap-4 p-4 rounded-md shadow-xl min-h-[500px]"
                onClick={(e) => e.stopPropagation()} 
            >
                <button 
                    onClick={onClose} 
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <X className="text-black" />
                </button>
                
                <DemandActionTimeLine demand={demand} selectedDate={selectedDate} />
                
            </div>
        </div>
    );
}