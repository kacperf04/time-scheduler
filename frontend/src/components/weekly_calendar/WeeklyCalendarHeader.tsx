
interface WeeklyCalendarHeaderProps {
    days: string[];
};

export default function WeeklyCalendarHeader(props: WeeklyCalendarHeaderProps) {
    return (
        <div className="flex flex-row justify-center gap-12 bg-bg-surface-raised px-8 py-2 rounded-t-lg">
            <div className="flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-text-body">Hour</span>
            </div>
            {
                props.days.map(day => {
                    const date = new Date(day);
                    const weekDay = date.toLocaleDateString("en-EN", { weekday: "long" });

                    return (
                        <div key={day} className="flex flex-col justify-center items-center">
                            <span className="text-xl font-bold text-text-body">{weekDay}</span>
                            <span className="text-sm text-text-body">{day}</span>
                        </div>
                    );
                })
            }
        </div>
    );
}