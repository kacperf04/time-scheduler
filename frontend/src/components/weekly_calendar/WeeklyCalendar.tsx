import WeeklyCalendarBody from "./WeeklyCalendarBody";
import WeeklyCalendarHeader from "./WeeklyCalendarHeader";
import { Availability } from "@/types";

interface WeeklyCalendarProps {
    mode?: WeeklyCalendarMode;
    offset?: number;
    hourLowerBound: number;
    hourUpperBound: number;
    userAvailability: Availability[];
}

export type WeeklyCalendarMode = "view" | "edit";

const getCurrentWeek = (offset: number) => {
    const curr = new Date();
    curr.setDate(curr.getDate() - 1 - offset * 7);
    const week = [];

    for (let i = 1; i <= 7; ++i) {
        const first = curr.getDate() - curr.getDay() + i;
        const day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        week.push(day);
    }

    return week;
};

export default function WeeklyCalendar(props: WeeklyCalendarProps) {
    const mode = props.mode || "view";
    const offset = props.offset || 0;

    const week = getCurrentWeek(offset);
    return (
        <div className="rounded-lg border-border-default overflow-hidden">
            <WeeklyCalendarHeader days={week}/>
            <WeeklyCalendarBody days={week} hourLowerBound={8} hourUpperBound={20} mode={mode} userAvailability={props.userAvailability} editDisabled={offset != -1}/>
        </div>
    );
}