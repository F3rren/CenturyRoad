import { DashboardStats, useDashboard } from "@/features/dashboard";

export function DashboardPage() {
  const { stats, loading } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Panoramica generale</p>
      </div>
      {loading ? (
        <p className="text-muted-foreground text-sm">Caricamento...</p>
      ) : (
        <DashboardStats stats={stats} />
      )}
    </div>
  );
}
