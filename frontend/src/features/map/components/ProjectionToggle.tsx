import { Globe, Map as MapFlat } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectionType } from '../types';

interface ProjectionToggleProps {
  value: ProjectionType;
  onChange: (projection: ProjectionType) => void;
}

const options: { value: ProjectionType; label: string; Icon: typeof Globe }[] = [
  { value: 'mercator', label: 'Pianisfero', Icon: MapFlat },
  { value: 'globe',    label: 'Globo',      Icon: Globe },
];

export function ProjectionToggle({ value, onChange }: ProjectionToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 p-1">
      {options.map(({ value: opt, label, Icon }) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 select-none',
            value === opt
              ? 'bg-white text-black shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          )}
          aria-pressed={value === opt}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
