import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ProjectionType } from '../types';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

interface MapViewProps {
  projection: ProjectionType;
}

export function MapView({ projection }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Init once on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [10, 20],
      zoom: 1.8,
      projection: { type: projection },
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'bottom-right',
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left',
    );

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to projection changes after init
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => map.setProjection({ type: projection });
    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once('styledata', apply);
    }
  }, [projection]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-100"
      aria-label="Mappa storica interattiva del Novecento"
    />
  );
}
