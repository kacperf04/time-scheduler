import WeeklyCalendarBody from "./WeeklyCalendarBody";
import WeeklyCalendarHeader from "./WeeklyCalendarHeader";

interface WeeklyCalendarProps {
    mode?: WeeklyCalendarMode;
    offset?: number;
    hourLowerBound: number;
    hourUpperBound: number;
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
        <div className="max-w-3/4 rounded-lg border-2 border-border-default">
            <WeeklyCalendarHeader days={week}/>
            <WeeklyCalendarBody days={week} hourLowerBound={8} hourUpperBound={23}/>
        </div>
    );
}