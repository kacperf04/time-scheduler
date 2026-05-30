export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-10 bg-bg-surface-raised">
      {children}
    </main>
  );
}