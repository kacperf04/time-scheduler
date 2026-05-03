interface WeeklyCalendarBodyProps {
    days: string[];
    hourLowerBound: number;
    hourUpperBound: number;
}

const getWorkingHours = (lowerBound: number, upperBound: number) => {
    return [...Array(upperBound - lowerBound + 1).keys()].map(i => i + lowerBound);
}

export default function WeeklyCalendarBody(props: WeeklyCalendarBodyProps) {
    const workingHours = getWorkingHours(props.hourLowerBound, props.hourUpperBound);

    return (
        <div className="w-full h-full bg-bg-surface-raised px-8">
            <div className="h-full flex flex-col justify-center">
                {
                    getWorkingHours(props.hourLowerBound, props.hourUpperBound).map(hour => (
                        <span className="text-lg text-text-body font-bold py-2" key={hour}>{hour}</span>
                    ))
                }
            </div>

            <div>

            </div>
        </div>
    );
}