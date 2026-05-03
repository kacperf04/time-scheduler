"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const isDragging = useRef(false);
    const dragAction = useRef<"add" | "remove">("add");

    const workingHours = getWorkingHours(props.hourLowerBound, props.hourUpperBound);

    const handleCellMouseDown = useCallback((cellId: string) => {
        if (props.mode != "edit") return;

        isDragging.current = true;
        dragAction.current = selectedCells.has(cellId) ? "remove" : "add";

        setSelectedCells(prev => {
            const next = new Set(prev);
            dragAction.current == "add" ? next.add(cellId) : next.delete(cellId);

            return next;
        });
    }, [props.mode, selectedCells]);

    const handleCellMouseEnter = useCallback((cellId: string) => {
        if (!isDragging.current || props.mode !== "edit") return;

        setSelectedCells(prev => {
        const next = new Set(prev);
        dragAction.current == "add" ? next.add(cellId) : next.delete(cellId);
        return next;
        });
    }, [props.mode]);

    useEffect(() => {
        const handleMouseUp = () => { isDragging.current = false; };
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    return (
        <div className="flex flex-row w-full h-full bg-bg-surface-raised">
            
            <div className="w-20 shrink-0 flex flex-col bg-text-body">
                {workingHours.map(hour => (
                    <div key={hour} className="h-10 flex justify-center items-center">
                        <span className="text-lg text-text-inverse-muted font-bold pb-10">{hour}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 min-w-[170px] flex flex-row bg-text-body" onMouseLeave={() => { isDragging.current = false; }}>
                {props.days.map(day => (
                    <div key={day} id={day} className="flex-1 flex flex-col">
                        {workingHours.slice(0, workingHours.length - 1).map(hour => {
                            const hourFrom = hour;
                            const hourTo = hour + 1;
                            const cellId = hourFrom + ";" + hourTo + ";" + day;
                            const isSelected = selectedCells.has(cellId);
                            
                            return (
                                <div 
                                    key={hour + ";" + day} 
                                    id={cellId} 
                                    onMouseDown={() => handleCellMouseDown(cellId)}
                                    onMouseEnter={() => handleCellMouseEnter(cellId)}
                                    className={`h-10 flex justify-center items-center text-center text-lg text-text-body font-bold select-none ${props.mode == "edit" ? "cursor-pointer" : ""} border border-border-inverse
                                                ${isSelected
                                                    ? "bg-text-secondary"
                                                    : "bg-bg-surface-raised"
                                                }
                                                ${
                                                    hour == props.hourUpperBound - 1
                                                    ? "border-b-2"
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