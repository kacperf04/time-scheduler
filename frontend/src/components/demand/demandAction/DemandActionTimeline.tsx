import React, { useState, useCallback, useRef, useEffect } from "react";
import { Demand, DemandSlot, EmployeeRole } from "@/types";
import { WORK_START_HOUR, WORK_END_HOUR } from "@/constants";

interface Props {
    demand: Demand | null;
    selectedDate?: string;
    // Split into clear RESTful callbacks
    onCreate?: (newSlot: DemandSlot) => void;
    onUpdate?: (originalSlot: DemandSlot, updatedSlot: DemandSlot) => void;
    onDelete?: (slotToDelete: DemandSlot) => void;
}

// Internal type to handle form drafting without mutating real data
type DraftSlot = {
    tempId: string;
    originalData?: DemandSlot; // Undefined if it's a completely new draft
    role: EmployeeRole;
    start_time: number;
    end_time: number;
    required_employees: number;
    isNew?: boolean;
};

export default function DemandActionTimeLine({ 
    demand, 
    selectedDate, 
    onCreate, 
    onUpdate, 
    onDelete 
}: Props) {
    const workHours = Array.from(
        { length: WORK_END_HOUR - WORK_START_HOUR + 1 },
        (_, i) => i + WORK_START_HOUR
    );
    const roles = Object.values(EmployeeRole);
    const n_hours = workHours.length;

    const [selectedSlot, setSelectedSlot] = useState<DraftSlot | null>(null);
    const [dragState, setDragState] = useState<{
        role: EmployeeRole; start: number; current: number;
    } | null>(null);
    const isDragging = useRef(false);

    // Form state
    const [fRole, setFRole] = useState<EmployeeRole>(roles[0]);
    const [fStart, setFStart] = useState(WORK_START_HOUR);
    const [fEnd, setFEnd] = useState(WORK_START_HOUR + 1);
    const [fCount, setFCount] = useState(1);

    const getSlot = useCallback((hour: number, role: EmployeeRole): DraftSlot | undefined => {
        if (!demand?.slots) return undefined;
        
        // 1. Check for existing saved slots
        const real = demand.slots.find(s => {
            const matchesDate = selectedDate ? s.date === selectedDate : true;
            return s.required_role === role && hour >= s.start_time && hour < s.end_time && matchesDate;
        });
        
        if (real) {
            return {
                tempId: `saved-${real.date}-${real.start_time}-${real.required_role}`,
                originalData: real,
                role: real.required_role,
                start_time: real.start_time,
                end_time: real.end_time,
                required_employees: real.required_employees
            };
        }

        // 2. Check for the actively dragged "new" draft slot
        if (selectedSlot?.isNew && selectedSlot.role === role &&
            hour >= selectedSlot.start_time && hour < selectedSlot.end_time) {
            return selectedSlot;
        }
        
        return undefined;
    }, [demand, selectedDate, selectedSlot]);

    const populateForm = (slot: DraftSlot) => {
        setFRole(slot.role);
        setFStart(slot.start_time);
        setFEnd(slot.end_time);
        setFCount(slot.required_employees);
        setSelectedSlot(slot);
    };

    const handleSelectSlot = (slot: DraftSlot) => {
        populateForm(slot);
    };

    const handleMouseDown = (role: EmployeeRole, hour: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        setDragState({ role, start: hour, current: hour });
    };

    const handleMouseEnter = (role: EmployeeRole, hour: number) => () => {
        if (!isDragging.current) return;
        setDragState(prev => prev?.role === role ? { ...prev, current: hour } : prev);
    };

    const handleMouseUp = useCallback(() => {
        if (!isDragging.current || !dragState) { isDragging.current = false; return; }
        isDragging.current = false;

        const start = Math.min(dragState.start, dragState.current);
        const end = Math.max(dragState.start, dragState.current) + 1;

        const hasOverlap = demand?.slots?.some(s => {
            const matchesDate = selectedDate ? s.date === selectedDate : true;
            return matchesDate && s.required_role === dragState.role &&
                s.start_time < end && s.end_time > start;
        });

        if (!hasOverlap && end > start) {
            const draft: DraftSlot = {
                tempId: `draft-${Date.now()}`,
                role: dragState.role,
                start_time: start,
                end_time: end,
                required_employees: 1,
                isNew: true,
            };
            populateForm(draft);
        }
        setDragState(null);
    }, [dragState, demand, selectedDate]);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseUp]);

    const isDragHighlighted = (role: EmployeeRole, hour: number) => {
        if (!dragState || dragState.role !== role) return false;
        const s = Math.min(dragState.start, dragState.current);
        const e = Math.max(dragState.start, dragState.current);
        return hour >= s && hour <= e;
    };

    const handleSave = () => {
        if (!selectedSlot) return;
        if (fEnd <= fStart) return; // Basic validation

        const targetDate = selectedDate || demand?.start_date || new Date().toISOString().split('T')[0];

        const payload: DemandSlot = {
            date: targetDate,
            required_role: fRole,
            start_time: fStart,
            end_time: fEnd,
            required_employees: fCount,
        };

        if (selectedSlot.isNew) {
            onCreate?.(payload);
        } else if (selectedSlot.originalData) {
            onUpdate?.(selectedSlot.originalData, payload);
        }
        
        setSelectedSlot(null);
    };

    const handleDelete = () => {
        if (!selectedSlot || selectedSlot.isNew) {
            setSelectedSlot(null);
            return;
        }
        if (selectedSlot.originalData) {
            onDelete?.(selectedSlot.originalData);
        }
        setSelectedSlot(null);
    };

    const duration = fEnd - fStart;

    return (
        <div className="flex flex-row gap-4">
        <div className="flex h-full rounded-xl overflow-hidden">
            <div className="flex-1 min-w-0 overflow-auto">
                <div
                    className="grid min-w-max border-l border-secondary-container/20 select-none"
                    style={{ gridTemplateColumns: `88px repeat(${n_hours}, minmax(68px, 1fr))` }}
                >
                    {/* Header */}
                    <div className="sticky left-0 z-20 h-10 px-3 flex items-end pb-2 bg-background border-r border-b-[1.5px] border-secondary-container/20 border-b-secondary-container/40 text-[11px] font-medium tracking-widest uppercase text-on-surface/40">
                        Role
                    </div>
                    {workHours.map(h => (
                        <div key={h} className="h-10 pl-1.5 flex items-end pb-2 border-l border-b-[1.5px] border-secondary-container/20 border-b-secondary-container/40 text-[11px] font-medium text-on-surface/40 whitespace-nowrap">
                            {String(h).padStart(2, "0")}:00
                        </div>
                    ))}

                    {roles.map(role => {
                        const cells: React.ReactNode[] = []
                        cells.push(
                            <div key={`lbl-${role}`} className="sticky left-0 z-10 bg-background px-3 text-[11px] tracking-widest uppercase text-on-surface font-semibold flex items-center min-h-16">
                                {role}
                            </div>
                        );

                        let h = WORK_START_HOUR;
                        while (h <= WORK_END_HOUR) {
                            const slot = getSlot(h, role);
                            if (slot) {
                                const span = Math.min(slot.end_time, WORK_END_HOUR + 1) - h;
                                const isSelected = selectedSlot?.tempId === slot.tempId;
                                
                                cells.push(
                                    <div key={`slot-${role}-${h}`} className="border-l border-b border-secondary-container/20 min-h-[52px] p-1.5" style={{ gridColumn: `span ${span}` }}>
                                        <div
                                            onClick={() => handleSelectSlot(slot)}
                                            className={`w-full h-full min-h-10 px-2 flex items-center justify-center gap-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all whitespace-nowrap ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}`}
                                            style={{ background: "var(--color-background-info)", border: "0.5px solid var(--color-border-info)", color: "var(--color-text-info)" }}
                                        >
                                            {slot.required_employees} needed
                                        </div>
                                    </div>
                                );
                                h += span;
                            } else {
                                const dragging = isDragHighlighted(role, h);
                                cells.push(
                                    <div
                                        key={`empty-${role}-${h}`}
                                        onMouseDown={handleMouseDown(role, h)}
                                        onMouseEnter={handleMouseEnter(role, h)}
                                        className={`border-l border-b border-secondary-container/20 min-h-[52px] cursor-crosshair transition-colors relative ${dragging ? "bg-primary/8" : "hover:bg-secondary-container/5"}`}
                                    >
                                        {dragging && <div className="absolute inset-[3px] border-[1.5px] border-dashed border-primary/40 rounded-lg pointer-events-none" />}
                                    </div>
                                );
                                h++;
                            }
                        }
                        return <React.Fragment key={role}>{cells}</React.Fragment>;
                    })}
                </div>
            </div>

            
        </div>


            {/* ── Edit panel ── */}
            <div className="w-[220px] flex-shrink-0 flex flex-col border-l border-secondary-container/20 bg-background">
                <div className="px-4 py-3 border-b border-secondary-container/15 flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-widest uppercase text-on-surface/50">Edit</span>
                    {selectedSlot && (
                        <button onClick={() => setSelectedSlot(null)} className="text-on-surface/30 hover:text-on-surface/60 transition-colors p-0.5 rounded">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-label="Close"><path d="M12.2 3.8a1 1 0 0 0-1.4 0L8 6.6 5.2 3.8a1 1 0 0 0-1.4 1.4L6.6 8l-2.8 2.8a1 1 0 0 0 1.4 1.4L8 9.4l2.8 2.8a1 1 0 0 0 1.4-1.4L9.4 8l2.8-2.8a1 1 0 0 0 0-1.4Z"/></svg>
                        </button>
                    )}
                </div>

                {!selectedSlot ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-8 text-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface/25" aria-hidden="true"><path d="M15 15l6 6M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"/></svg>
                        <p className="text-[12px] text-on-surface/40 leading-relaxed">Click a slot to edit it, or drag across empty cells to add a new demand</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
                            <div className="flex gap-1.5 flex-wrap">
                                <span className="text-[11px] font-medium px-2 py-1 rounded-full" style={{ background: "var(--color-background-info)", color: "var(--color-text-info)" }}>{fRole}</span>
                                <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-secondary-container/20 text-on-surface/60">{String(fStart).padStart(2,"0")}:00–{String(fEnd).padStart(2,"0")}:00</span>
                                <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-secondary-container/20 text-on-surface/60">{duration}h</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-on-surface/50">Role</label>
                                <select value={fRole} onChange={e => setFRole(e.target.value as EmployeeRole)} className="w-full text-[13px] border border-secondary-container/30 rounded p-1">
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-on-surface/50">Start time</label>
                                <select value={fStart} onChange={e => setFStart(Number(e.target.value))} className="w-full text-[13px] border border-secondary-container/30 rounded p-1">
                                    {workHours.map(h => <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-on-surface/50">End time</label>
                                <select value={fEnd} onChange={e => setFEnd(Number(e.target.value))} className="w-full text-[13px] border border-secondary-container/30 rounded p-1">
                                    {workHours.filter(h => h > WORK_START_HOUR).concat([WORK_END_HOUR + 1]).map(h => (
                                        <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-on-surface/50">Employees needed</label>
                                <input type="number" min={1} max={99} value={fCount} onChange={e => setFCount(Math.max(1, Number(e.target.value)))} className="w-full text-[13px] border border-secondary-container/30 rounded p-1" />
                            </div>
                        </div>

                        <div className="p-3 border-t border-secondary-container/15 flex flex-col gap-2">
                            <button onClick={handleSave} className="w-full py-2 text-[13px] font-medium bg-primary text-on-primary rounded-lg hover:opacity-85 transition-opacity">
                                {selectedSlot.isNew ? "Create Demand" : "Save Changes"}
                            </button>
                            {!selectedSlot.isNew && (
                                <button onClick={handleDelete} className="w-full py-2 text-[13px] font-medium border border-error/40 text-error rounded-lg hover:bg-error/5 transition-colors">
                                    Remove slot
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}