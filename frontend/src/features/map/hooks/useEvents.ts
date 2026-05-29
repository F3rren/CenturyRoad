import { useMemo } from 'react';
import { MOCK_EVENTS } from '../data/mockEvents';
import type { HistoricalEvent } from '../types';

function todayMonthDay() {
  const d = new Date();
  return { month: d.getMonth() + 1, day: d.getDate() };
}

function compareDayMonth(
  event: HistoricalEvent,
  ref: { month: number; day: number },
): 'before' | 'same' | 'after' {
  if (event.month < ref.month) return 'before';
  if (event.month > ref.month) return 'after';
  if (event.day < ref.day) return 'before';
  if (event.day === ref.day) return 'same';
  return 'after';
}

export function useEvents(countryCode: string | null | undefined) {
  const today = useMemo(() => todayMonthDay(), []);

  const todayEvents = useMemo(
    () =>
      MOCK_EVENTS.filter(
        (e) => e.month === today.month && e.day === today.day,
      ).sort((a, b) => a.year - b.year),
    [today],
  );

  const fallbackEvents = useMemo(
    () =>
      MOCK_EVENTS.filter((e) => e.importance === 'high')
        .sort((a, b) => a.year - b.year)
        .slice(0, 10),
    [],
  );

  const globalEvents = todayEvents.length > 0 ? todayEvents : fallbackEvents;

  const countryFiltered = useMemo(() => {
    if (!countryCode) return null;
    const all = MOCK_EVENTS.filter((e) => e.countryCode === countryCode).sort(
      (a, b) => a.year - b.year,
    );
    const past = all.filter((e) => {
      const cmp = compareDayMonth(e, today);
      return cmp === 'before' || cmp === 'same';
    });
    const upcoming = all.filter((e) => compareDayMonth(e, today) === 'after');
    return { all, past, upcoming };
  }, [countryCode, today]);

  return { globalEvents, countryFiltered, todayEvents, today };
}
