"use client";

import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createToolboxId } from "./lib/dnd-utils";
import type { FieldType, FieldTypeConfig } from "./lib/form-config";

interface DraggableToolboxItemProps {
  fieldType: FieldTypeConfig;
  onAddField: (type: FieldType) => void;
}

export function DraggableToolboxItem({
  fieldType,
  onAddField,
}: DraggableToolboxItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: createToolboxId(fieldType.type),
  });

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className={cn(
        "flex flex-col items-center justify-center h-16 w-full gap-1.5 whitespace-normal px-2 py-3 text-xs hover:border-primary hover:text-primary transition-all [&>svg]:shrink-0",
        isDragging && "opacity-50"
      )}
      onClick={() => onAddField(fieldType.type)}
      {...listeners}
      {...attributes}
    >
      <fieldType.icon className="h-5 w-5" />
      <span className="text-[10px] font-medium leading-tight text-center">
        {fieldType.label}
      </span>
    </Button>
  );
}
