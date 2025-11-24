"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FieldEditor } from "./field-editor";
import type { FieldConfig } from "@/lib/form-config";

interface SortableFormFieldProps {
  field: FieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate?: (e: React.MouseEvent) => void;
  onUpdate: (field: FieldConfig) => void;
  children: React.ReactNode;
}

export function SortableFormField({
  field,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  children,
}: SortableFormFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const [isEditing, setIsEditing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 h-24 border-2 border-dashed border-primary/50 rounded-md bg-muted/50"
      />
    );
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative group p-4 border rounded-lg bg-background shadow-lg ring-1 ring-primary/20"
        )}
      >
        <FieldEditor
          field={field}
          onUpdate={onUpdate}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-foreground transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Field Box */}
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => onSelect()}
        className={cn(
          "relative group flex items-start gap-3 p-4 border rounded-lg bg-background transition-all hover:shadow-sm border-border flex-1",
          isSelected && "ring-2 ring-primary/50"
        )}
      >
        {children}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          title="Validation Settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
        {onDuplicate && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(e);
            }}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
