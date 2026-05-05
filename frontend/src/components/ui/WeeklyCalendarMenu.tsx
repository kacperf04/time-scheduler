"use client";

import { Pencil, PencilOff, Save, Trash } from 'lucide-react';

interface WeeklyCalendarMenuProps {
    editMode: boolean;
    onEditStart: () => void;
    onEditCancel: () => void;
    onSave?: () => void;
    onDelete?: () => void;
}

export default function WeeklyCalendarMenu({ 
    editMode, 
    onEditStart, 
    onEditCancel,
    onSave,
    onDelete 
}: WeeklyCalendarMenuProps) {
    return (
        <div className='fixed right-5 bottom-4 rounded-lg py-2 px-3 flex flex-row items-center h-10 bg-text-body text-bg-surface-raised isolation-auto z-50'>
            <div 
                className={`flex flex-row gap-3 transition-all duration-200 ease-in-out ${
                    editMode 
                        ? "opacity-100 translate-x-0 pointer-events-auto w-[60px]" 
                        : "opacity-0 -translate-x-2 pointer-events-none w-0"
                }`}
            >
                <Save onClick={onSave} size={32} className="shrink-0 w-6 h-6 cursor-pointer" />
                <Trash onClick={onDelete} size={32} className="shrink-0 w-6 h-6 cursor-pointer" />
            </div>

            <div className={`transition-all duration-200 ${editMode ? "w-3" : "w-0"}`} />

            <div className="relative w-6 h-6 shrink-0">
                <Pencil 
                    onClick={onEditStart} 
                    size={32} 
                    className={`absolute inset-0 shrink-0 w-6 h-6 cursor-pointer transition-all duration-200 ${
                        editMode 
                            ? "opacity-0 scale-75 pointer-events-none rotate-45" 
                            : "opacity-100 scale-100 pointer-events-auto rotate-0"
                    }`}
                />
                <PencilOff 
                    onClick={onEditCancel} 
                    size={32} 
                    className={`absolute inset-0 shrink-0 w-6 h-6 cursor-pointer transition-all duration-200 ${
                        editMode 
                            ? "opacity-100 scale-100 pointer-events-auto rotate-0" 
                            : "opacity-0 scale-75 pointer-events-none -rotate-45"
                    }`}
                />
            </div>
        </div>
    );
}