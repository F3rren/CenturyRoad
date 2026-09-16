import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Country, ProjectionType } from '../types';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
const COUNTRIES_GEOJSON =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson';

// ── Heat map helpers ─────────────────────────────────────────────────────────

function heatColor(count: number): string {
  if (count >= 6) return '#ef4444'; // rosso
  if (count >= 3) return '#eab308'; // giallo
  return '#22c55e';                  // verde
}

function buildHeatExpression(
  heatmap: Record<string, number>,
): maplibregl.ExpressionSpecification {
  const entries = Object.entries(heatmap);
  if (!entries.length) {
    return 'rgba(0,0,0,0)' as unknown as maplibregl.ExpressionSpecification;
  }
  return [
    'match',
    ['get', 'iso_a2'],
    ...entries.flatMap(([code, count]) => [code, heatColor(count)]),
    'rgba(0,0,0,0)',
  ] as maplibregl.ExpressionSpecification;
}

// ── Component ────────────────────────────────────────────────────────────────

interface MapViewProps {
  projection: ProjectionType;
  onCountryClick?: (country: Country) => void;
  selectedCountryCode?: string | null;
  countryHeatmap?: Record<string, number>;
}

export function MapView({
  projection,
  onCountryClick,
  selectedCountryCode,
  countryHeatmap,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  // Ref avoids stale-closure issue in the once('load') callback
  const heatmapRef = useRef<Record<string, number>>(countryHeatmap ?? {});

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

    map.once('load', () => {
      map.addSource('countries-ne', {
        type: 'geojson',
        data: COUNTRIES_GEOJSON,
      });

      // 1. Heatmap fill (colori verde/giallo/rosso)
      map.addLayer({
        id: 'countries-heat',
        type: 'fill',
        source: 'countries-ne',
        paint: {
          'fill-color': buildHeatExpression(heatmapRef.current),
          'fill-opacity': 0.8,
        },
      });

      // 2. Transparent fill for click detection
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries-ne',
        paint: { 'fill-color': 'transparent', 'fill-opacity': 0 },
      });

      // 3. Blue highlight for selected country
      map.addLayer({
        id: 'countries-highlight',
        type: 'fill',
        source: 'countries-ne',
        filter: ['==', 'iso_a2', ''],
        paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.3 },
      });

      // 4. Border for selected country
      map.addLayer({
        id: 'countries-outline',
        type: 'line',
        source: 'countries-ne',
        filter: ['==', 'iso_a2', ''],
        paint: { 'line-color': '#3b82f6', 'line-width': 1.5 },
      });

      map.on('click', 'countries-fill', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as Record<string, string>;
        const code = props['iso_a2'] ?? '';
        const name = props['name'] ?? props['admin'] ?? '';
        if (code && name) onCountryClick?.({ name, code });
      });

      map.on('mouseenter', 'countries-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'countries-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync projection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => map.setProjection({ type: projection });
    if (map.isStyleLoaded()) apply();
    else map.once('styledata', apply);
  }, [projection]);

  // Sync country highlight (selected)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const code = selectedCountryCode ?? '';
    const filter: maplibregl.FilterSpecification = ['==', 'iso_a2', code];
    if (map.getLayer('countries-highlight')) map.setFilter('countries-highlight', filter);
    if (map.getLayer('countries-outline')) map.setFilter('countries-outline', filter);
  }, [selectedCountryCode]);

  // Sync heatmap colors
  useEffect(() => {
    heatmapRef.current = countryHeatmap ?? {};
    const map = mapRef.current;
    if (!map || !map.getLayer('countries-heat')) return;
    map.setPaintProperty(
      'countries-heat',
      'fill-color',
      buildHeatExpression(heatmapRef.current),
    );
  }, [countryHeatmap]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-100"
      aria-label="Mappa storica interattiva del Novecento"
    />
  );
}
