import { useEffect, useState } from "react";
import type { StatCard } from "../types";

export function useDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API call: api.get<StatCard[]>('/dashboard/stats')
    const mockStats: StatCard[] = [
      { id: "1", label: "Utenti totali", value: 1240, change: 12 },
      { id: "2", label: "Ricavi mensili", value: "€ 48.200", change: 8 },
      { id: "3", label: "Ordini attivi", value: 87, change: -3 },
    ];
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 500);
  }, []);

  return { stats, loading };
}
