import { useState } from 'react';
import { MapView, ProjectionToggle } from '@/features/map';
import type { ProjectionType } from '@/features/map';

export function MapPage() {
  const [projection, setProjection] = useState<ProjectionType>('globe');

  return (
    <div className="relative h-full w-full">
      <MapView projection={projection} />
      <div className="absolute top-4 right-4 z-10">
        <ProjectionToggle value={projection} onChange={setProjection} />
      </div>
    </div>
  );
}
