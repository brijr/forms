"use client";

import { Button } from "@/components/ui/button";
import { Settings2, Copy, Trash2 } from "lucide-react";

interface FieldActionsProps {
  onSettingsClick: (e: React.MouseEvent) => void;
  onDuplicate?: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function FieldActions({
  onSettingsClick,
  onDuplicate,
  onDelete,
}: FieldActionsProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSettingsClick}
        title="Validation Settings"
      >
        <Settings2 />
      </Button>
      {onDuplicate && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDuplicate}
          title="Duplicate"
        >
          <Copy />
        </Button>
      )}
      <Button variant="ghost" size="icon" onClick={onDelete} title="Delete">
        <Trash2 />
      </Button>
    </div>
  );
}
