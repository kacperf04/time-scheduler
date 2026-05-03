
interface WeeklyCalendarHeaderProps {
    days: string[];
};

export default function WeeklyCalendarHeader(props: WeeklyCalendarHeaderProps) {
    return (
        <div className="flex flex-row w-full bg-text-body rounded-t-lg pb-3">
            <div className="w-20 shrink-0 flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-text-inverse py-2">Hour</span>
            </div>
            <div className="flex-1 flex flex-row">
                {
                    props.days.map(day => {
                        const date = new Date(day);
                        const weekDay = date.toLocaleDateString("en-EN", { weekday: "long" });

                        return (
                            <div key={day} className="flex-1 min-w-[170px] flex flex-col justify-center items-center">
                                <span className="text-xl font-bold text-text-inverse pt-2">{weekDay}</span>
                                <span className="text-sm text-text-inverse-muted pb-2">{day}</span>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}