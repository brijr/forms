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
    <div className="flex flex-col gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={onSettingsClick}
        title="Validation Settings"
      >
        <Settings2 className="h-4 w-4" />
      </Button>
      {onDuplicate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onDuplicate}
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
