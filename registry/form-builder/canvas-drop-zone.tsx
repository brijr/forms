"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { CANVAS_DROP_ZONE_ID } from "./lib/dnd-utils";

interface CanvasDropZoneProps {
  children: React.ReactNode;
  isEmpty: boolean;
}

export function CanvasDropZone({ children, isEmpty }: CanvasDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: CANVAS_DROP_ZONE_ID,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[200px] rounded-lg border border-transparent transition-all",
        isOver && "bg-primary/5 border-primary/40 border-dashed",
        isEmpty && "flex items-center justify-center"
      )}
    >
      {children}
    </div>
  );
}
