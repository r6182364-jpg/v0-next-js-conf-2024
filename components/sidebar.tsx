'use client';

import { LayoutDashboard, Upload, FileText, Shield, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeView: "dashboard" | "upload" | "report";
  onViewChange: (view: "dashboard" | "upload" | "report") => void;
}

const navigationItems = [
  { id: "dashboard" as const, label: "Overview", icon: LayoutDashboard },
  { id: "upload" as const, label: "New Review", icon: Upload },
  { id: "report" as const, label: "Reports", icon: FileText },
];

const resourceItems = [
  { label: "Standards Library", icon: BookOpen },
  { label: "Design Guidelines", icon: Shield },
  { label: "Quick Reference", icon: Zap },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">Smart Guardian</span>
          <span className="text-xs text-muted-foreground">PV Review System</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </span>
        </div>
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              activeView === item.id && "bg-sidebar-accent text-sidebar-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
        
        <div className="mb-4 mt-8">
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Resources
          </span>
        </div>
        {resourceItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-4">
          <h4 className="text-sm font-medium text-sidebar-accent-foreground">Supported Standards</h4>
          <div className="mt-2 flex flex-wrap gap-1">
            {["IEC", "SBC", "SEC", "MOMRA", "WERA"].map((std) => (
              <span
                key={std}
                className="rounded bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {std}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
