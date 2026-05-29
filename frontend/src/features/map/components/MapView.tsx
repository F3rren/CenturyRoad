import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Country, ProjectionType } from '../types';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
const COUNTRIES_GEOJSON =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson';

interface MapViewProps {
  projection: ProjectionType;
  onCountryClick?: (country: Country) => void;
  selectedCountryCode?: string | null;
}

export function MapView({ projection, onCountryClick, selectedCountryCode }: MapViewProps) {
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

    map.once('load', () => {
      // Country polygons for click detection
      map.addSource('countries-ne', {
        type: 'geojson',
        data: COUNTRIES_GEOJSON,
      });

      // Transparent fill layer used only for click/hover targeting
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries-ne',
        paint: { 'fill-color': 'transparent', 'fill-opacity': 0 },
      });

      // Highlight layer — filtered to the selected country
      map.addLayer({
        id: 'countries-highlight',
        type: 'fill',
        source: 'countries-ne',
        filter: ['==', 'ISO_A2', ''],
        paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.25 },
      });

      // Country border for selected state
      map.addLayer({
        id: 'countries-outline',
        type: 'line',
        source: 'countries-ne',
        filter: ['==', 'ISO_A2', ''],
        paint: { 'line-color': '#3b82f6', 'line-width': 1.5 },
      });

      map.on('click', 'countries-fill', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as Record<string, string>;
        const code = props['ISO_A2'] ?? props['iso_a2'] ?? '';
        const name =
          props['NAME_EN'] ?? props['NAME'] ?? props['ADMIN'] ?? props['name'] ?? '';
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

  // Sync country highlight
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const code = selectedCountryCode ?? '';
    const filter: maplibregl.FilterSpecification = ['==', 'ISO_A2', code];
    if (map.getLayer('countries-highlight')) map.setFilter('countries-highlight', filter);
    if (map.getLayer('countries-outline')) map.setFilter('countries-outline', filter);
  }, [selectedCountryCode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-100"
      aria-label="Mappa storica interattiva del Novecento"
    />
  );
}
