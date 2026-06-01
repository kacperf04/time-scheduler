import { useEffect } from "react";
import { DemandSlot, DemandSlotActionType } from "@/types";
import { X } from "lucide-react";

interface DemandActionCardProps {
    demand: DemandSlot | null;
    onClose: () => void;
    actionType: DemandSlotActionType | null;
}

export default function DemandActionCard({
    demand,
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
                className="bg-white w-3/4 h-96 flex flex-col items-end gap-4 p-4 rounded-md shadow-xl"
                onClick={(e) => e.stopPropagation()} 
            >
                <button 
                    onClick={onClose} 
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <X className="text-black" />
                </button>

                {actionType}
                
            </div>
        </div>
    )
}