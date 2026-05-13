"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WeeklyCalendarMode } from "./WeeklyCalendar";
import { Availability } from "@/types";
import WeeklyCalendarMenu from "../ui/WeeklyCalendarMenu";
import api from "@/lib/api";

interface WeeklyCalendarBodyProps {
    days: string[];
    hourLowerBound: number;
    hourUpperBound: number;
    mode: WeeklyCalendarMode;
    userAvailability: Availability[];
    editDisabled: boolean;
}

const getWorkingHours = (lowerBound: number, upperBound: number) => {
    return [...Array(upperBound - lowerBound + 1).keys()].map(i => i + lowerBound);
}

export default function WeeklyCalendarBody(props: WeeklyCalendarBodyProps) {
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [confirmedCells, setConfirmedCells] = useState<Set<string>>(new Set());
    const pastSelectedCells = props.userAvailability;

    useEffect(() => {
        const newSet = new Set<string>();
        
        props.userAvailability.forEach((cell) => {
            const cellId = `${cell.start_hour};${cell.end_hour};${cell.date}`;
            newSet.add(cellId);
        });

        console.log("userAvailability:", props.userAvailability);
        console.log("confirmedCells built:", [...newSet]);

        setConfirmedCells(newSet);
        
    }, [props.userAvailability]);
    
    const [mode, setMode] = useState<WeeklyCalendarMode>(props.mode);
    
    const isDragging = useRef(false);
    const dragAction = useRef<"add" | "remove">("add");

    const workingHours = getWorkingHours(props.hourLowerBound, props.hourUpperBound);

    const handleCellMouseDown = useCallback((cellId: string) => {
        if (mode !== "edit") return;

        if (confirmedCells.has(cellId)) return;

        isDragging.current = true;
        dragAction.current = selectedCells.has(cellId) ? "remove" : "add";

        setSelectedCells(prev => {
            const next = new Set(prev);
            dragAction.current === "add" ? next.add(cellId) : next.delete(cellId);
            return next;
        });
    }, [mode, selectedCells, confirmedCells]);

    const handleCellMouseEnter = useCallback((cellId: string) => {
        if (!isDragging.current || mode !== "edit") return;

        if (confirmedCells.has(cellId)) return;

        setSelectedCells(prev => {
            const next = new Set(prev);
            dragAction.current === "add" ? next.add(cellId) : next.delete(cellId);
            return next;
        });
    }, [mode, confirmedCells]);

    useEffect(() => {
        const handleMouseUp = () => { isDragging.current = false; };
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    const handleCancelEdit = () => {
        if (props.editDisabled) return;

        setSelectedCells(new Set()); 
        setMode("view");
    };

    const handleEditStart = () => {
        if (props.editDisabled) return;

        setMode("edit");
    };

    const handleEditSave = async () => {
        if (props.editDisabled) return;

        setConfirmedCells(prev => new Set([...prev, ...selectedCells]));

        try {
            const results = await Promise.allSettled(
                [...selectedCells].map((cell) => {
                    const [startHour, endHour, date] = cell.split(";");

                    return {
                        date: date,
                        start_hour: startHour,
                        end_hour: endHour,
                        priority: 3
                    };
                })
            );

            const response = await api.post("/availabilities/bulk", results.map(res => { return res["value"] }));

            setMode("view");
        } catch (err) {
            console.error("Critical save error: ", err);
        }
    };

    return (
        <div className="flex flex-row w-full h-full bg-bg-surface-raised">
            <WeeklyCalendarMenu 
                disabled={props.editDisabled}
                editMode={mode === "edit"} 
                onEditStart={handleEditStart}
                onEditCancel={handleCancelEdit}
                onSave={handleEditSave}
                onDelete={() => setSelectedCells(new Set())}
            />
            
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
                            const cellId = `${String(hourFrom)};${String(hourTo)};${day}`;
                            const isSelected = selectedCells.has(cellId);
                            const isConfirmed = [...confirmedCells].some((cell) => {
                                const [startHourString, endHourString, date] = cell.split(";");
                                const startHour = parseInt(startHourString);
                                const endHour = parseInt(endHourString);
                                return date === day && startHour <= hourFrom && endHour >= hourTo;
                            });

                            let isViewModeCellSelected = false;
                            [...confirmedCells].map((cell) => {
                                const [startHourString, endHourString, date] = cell.split(";");
                                
                                const startHour = parseInt(startHourString);
                                const endHour = parseInt(endHourString);

                                if (date == day && startHour <= hourFrom && endHour >= hourTo && props.mode == "view") {
                                    isViewModeCellSelected = true;
                                    return;
                                }
                            });
                            
                            return (
                                <div 
                                    key={hour + ";" + day} 
                                    id={cellId} 
                                    onMouseDown={() => handleCellMouseDown(cellId)}
                                    onMouseEnter={() => handleCellMouseEnter(cellId)}
                                    className={`h-10 flex justify-center items-center text-center text-lg text-text-body font-bold select-none ${props.mode == "edit" ? "cursor-pointer" : ""} border border-border-inverse
                                                ${
                                                isConfirmed
                                                    ? "bg-bg-inverse"
                                                    : (isSelected || isViewModeCellSelected)
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