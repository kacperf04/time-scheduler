"use client";

import { useState, useEffect } from "react";
import { WeeklyCalendarMode } from "./WeeklyCalendar";

interface WeeklyCalendarBodyProps {
    days: string[];
    hourLowerBound: number;
    hourUpperBound: number;
    mode: WeeklyCalendarMode;
}

const getWorkingHours = (lowerBound: number, upperBound: number) => {
    return [...Array(upperBound - lowerBound + 1).keys()].map(i => i + lowerBound);
}

export default function WeeklyCalendarBody(props: WeeklyCalendarBodyProps) {
    const [selectedCells, setSelectedCells] = useState<string[]>([]);
    const workingHours = getWorkingHours(props.hourLowerBound, props.hourUpperBound);

    const toggleCell = (cellId: string) => {
        if (props.mode != "edit") return;

        setSelectedCells(prev => 
            prev.includes(cellId)
                ? prev.filter(id => id != cellId)
                : [...prev, cellId]
        );
    };

    useEffect(() => {
    console.log("State changed:", selectedCells);
}, [selectedCells]);

    return (
<div className="flex flex-row w-full h-full bg-bg-surface-raised">
            
            <div className="w-20 shrink-0 flex flex-col bg-text-body">
                {workingHours.map(hour => (
                    <div key={hour} className="h-10 flex justify-center items-center">
                        <span className="text-lg text-text-inverse-muted font-bold">{hour}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 min-w-[170px] flex flex-row">
                {props.days.map(day => (
                    <div key={day} id={day} className="flex-1 flex flex-col">
                        {workingHours.map(hour => {
                            const cellId = hour + ";" + day;
                            const isSelected = selectedCells.includes(cellId);
                            
                            return (
                                <div 
                                    key={hour + ";" + day} 
                                    id={cellId} 
                                    onClick={() => toggleCell(cellId)}
                                    className={`h-10 flex justify-center items-center text-center text-lg text-text-body font-bold select-none ${props.mode == "edit" ? "cursor-pointer" : ""} border transition-colors
                                                ${isSelected
                                                    ? "bg-text-secondary"
                                                    : "bg-bg-surface-raised"
                                                }
                                                ${
                                                    hour == props.hourUpperBound
                                                    ? "border-b-0"
                                                    : ""
                                                }
                                                ${
                                                    day == props.days[props.days.length - 1]
                                                    ? "border-r-0"
                                                    : ""
                                                }
                                                `       
                                            }
                                >
                                    
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

        </div>
    );
}