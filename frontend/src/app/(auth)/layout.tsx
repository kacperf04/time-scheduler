export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-10 bg-bg-surface-raised">
      <h1 className="text-text-body text-5xl font-heading">Time Scheduler</h1>
      <div className="w-full max-w-md bg-bg-surface rounded-xl border-2 border-border-default p-8">
        {children}
      </div>
    </main>
  );
}