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
    <div className="flex flex-col gap-1.5">
      <Button
        variant="outline"
        size="icon"
        onClick={onSettingsClick}
        title="Validation Settings"
      >
        <Settings2 className="h-4 w-4" />
      </Button>
      {onDuplicate && (
        <Button
          variant="outline"
          size="icon"
          onClick={onDuplicate}
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={onDelete} title="Delete">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
