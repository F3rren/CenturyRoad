import { useState } from 'react';
import { MapView, ProjectionToggle, EventsPanel } from '@/features/map';
import { HeatLegend } from '@/features/map/components/HeatLegend';
import { useEvents } from '@/features/map/hooks/useEvents';
import type { Country, ProjectionType } from '@/features/map';

export function MapPage() {
  const [projection, setProjection] = useState<ProjectionType>('globe');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const { countryHeatmap } = useEvents(selectedCountry?.code);

  return (
    <div className="flex h-full w-full">
      <EventsPanel
        selectedCountry={selectedCountry}
        onClearCountry={() => setSelectedCountry(null)}
      />
      <div className="relative flex-1">
        <MapView
          projection={projection}
          onCountryClick={setSelectedCountry}
          selectedCountryCode={selectedCountry?.code}
          countryHeatmap={countryHeatmap}
        />
        <div className="absolute top-4 right-4 z-10">
          <ProjectionToggle value={projection} onChange={setProjection} />
        </div>
        <div className="absolute bottom-8 right-4 z-10">
          <HeatLegend />
        </div>
      </div>
    </div>
  );
}
