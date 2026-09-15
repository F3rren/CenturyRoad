import { X, Globe, CalendarDays } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from './EventCard';
import type { Country, HistoricalEvent } from '../types';

const MONTH_NAMES = [
  '', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

interface SectionProps {
  title: string;
  events: HistoricalEvent[];
  emptyMessage?: string;
}

function Section({ title, events, emptyMessage }: SectionProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground italic px-1">
          {emptyMessage ?? 'Nessun evento'}
        </p>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

interface EventsPanelProps {
  selectedCountry: Country | null;
  onClearCountry: () => void;
}

export function EventsPanel({ selectedCountry, onClearCountry }: EventsPanelProps) {
  const { globalEvents, countryFiltered, today } = useEvents(selectedCountry?.code);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        {selectedCountry ? (
          <>
            <Globe className="h-4 w-4 shrink-0 text-primary" />
            <span className="flex-1 truncate text-sm font-semibold">
              {selectedCountry.name}
            </span>
            <button
              onClick={onClearCountry}
              className="rounded-md p-1 hover:bg-accent transition-colors"
              aria-label="Torna alla vista globale"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </>
        ) : (
          <>
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Accadde oggi nel '900</p>
              <p className="text-xs text-muted-foreground">
                {today.day} {MONTH_NAMES[today.month]}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {selectedCountry ? (
          countryFiltered?.all.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Globe className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Nessun evento registrato per{' '}
                <span className="font-medium">{selectedCountry.name}</span>
              </p>
              <button
                onClick={onClearCountry}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Torna alla vista globale
              </button>
            </div>
          ) : (
            <>
              <Section
                title={`Già accaduti (entro il ${today.day} ${MONTH_NAMES[today.month]})`}
                events={countryFiltered?.past ?? []}
                emptyMessage="Nessun evento prima di oggi in questo paese"
              />
              <Section
                title="In arrivo"
                events={countryFiltered?.upcoming ?? []}
                emptyMessage="Nessun evento dopo oggi in questo paese"
              />
            </>
          )
        ) : (
          <>
            {globalEvents.length > 0 && (
              <Section
                title={
                  globalEvents.some((e) => e.month === today.month && e.day === today.day)
                    ? `Anniversari del ${today.day} ${MONTH_NAMES[today.month]}`
                    : 'I più importanti del Novecento'
                }
                events={globalEvents}
              />
            )}
            <p className="text-xs text-muted-foreground text-center pt-2 pb-1">
              Clicca un paese sulla mappa per vedere i suoi eventi
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
