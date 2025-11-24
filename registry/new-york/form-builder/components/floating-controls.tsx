"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Upload, Download, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "builder" | "preview" | "json";

interface FloatingControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onImport: () => void;
  onExport: () => void;
}

export function FloatingControls({
  viewMode,
  onViewModeChange,
  onImport,
  onExport,
}: FloatingControlsProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {viewMode === "builder" && (
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      )}
      <div className="flex bg-background/95 backdrop-blur-sm border rounded-lg p-1">
        {(["builder", "preview", "json"] as const).map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(mode)}
            className={cn("capitalize", mode === "json" && "uppercase")}
          >
            {mode}
          </Button>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
