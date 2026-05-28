import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  className?: string;
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Impostazioni", href: "/settings", icon: Settings },
];

export function Sidebar({ open, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        open ? "w-60" : "w-0 overflow-hidden",
        className
      )}
    >
      <div className="flex h-14 items-center px-4 font-semibold text-lg">
        Century Road
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-sidebar-border"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
