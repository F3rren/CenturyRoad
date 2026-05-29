import { useState } from 'react';
import { MapView, ProjectionToggle, EventsPanel } from '@/features/map';
import type { Country, ProjectionType } from '@/features/map';

export function MapPage() {
  const [projection, setProjection] = useState<ProjectionType>('globe');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

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
        />
        <div className="absolute top-4 right-4 z-10">
          <ProjectionToggle value={projection} onChange={setProjection} />
        </div>
      </div>
    </div>
  );
}
