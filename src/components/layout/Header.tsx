import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
  className?: string;
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center border-b bg-background px-4 gap-4",
        className
      )}
    >
      <button
        onClick={onMenuToggle}
        className="rounded-md p-1.5 hover:bg-accent transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
    </header>
  );
}
