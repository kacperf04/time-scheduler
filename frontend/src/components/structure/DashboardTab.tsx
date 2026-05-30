import { User } from "@/types"

interface DashboardTabProps {
    user: User | null
};

export default function DashboardTab(
    {
        user
    } : DashboardTabProps
) {
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <h3 className="text-2xl font-mono self-start">Welcome, {user?.name}</h3>
        </div>
    )
}