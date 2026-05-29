import { cn } from '@/lib/utils';
import type { HistoricalEvent } from '../types';

const CATEGORY_STYLES: Record<HistoricalEvent['category'], string> = {
  war:      'bg-red-100 text-red-700',
  politics: 'bg-blue-100 text-blue-700',
  science:  'bg-purple-100 text-purple-700',
  culture:  'bg-yellow-100 text-yellow-700',
  disaster: 'bg-orange-100 text-orange-700',
  economy:  'bg-green-100 text-green-700',
};

const CATEGORY_LABELS: Record<HistoricalEvent['category'], string> = {
  war:      'Guerra',
  politics: 'Politica',
  science:  'Scienza',
  culture:  'Cultura',
  disaster: 'Disastro',
  economy:  'Economia',
};

interface EventCardProps {
  event: HistoricalEvent;
  compact?: boolean;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  return (
    <div className="group rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'shrink-0 rounded px-1.5 py-0.5 text-xs font-bold tabular-nums',
            CATEGORY_STYLES[event.category],
          )}
        >
          {event.year}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight line-clamp-2">
            {event.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {event.countryName} &middot;{' '}
            <span className={cn('font-medium', CATEGORY_STYLES[event.category].split(' ')[1])}>
              {CATEGORY_LABELS[event.category]}
            </span>
          </p>
          {!compact && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
