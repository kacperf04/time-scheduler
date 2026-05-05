import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex flex-row justify-between p-4 border-b-2 border-b-border-inverse bg-bg-surface w-full">
            <h1 className="text-text-body text-2xl font-heading">Time Scheduler</h1>
            <Link href="" className="text-text-body text-lg">Your schedule</Link>
            <button className="py-1 px-4 bg-bg-surface border-2 text-sm text-text-body rounded-lg cursor-pointer hover:bg-bg-subtle transition-all active:scale-90">
                Logout
            </button>
        </nav>
    );
}