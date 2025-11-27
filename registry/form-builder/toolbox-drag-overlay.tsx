"use client";

import { FIELD_TYPES, FieldType } from "./lib/form-config";

interface ToolboxDragOverlayProps {
  fieldType: FieldType;
}

export function ToolboxDragOverlay({ fieldType }: ToolboxDragOverlayProps) {
  const fieldConfig = FIELD_TYPES.find((f) => f.type === fieldType)!;
  const Icon = fieldConfig.icon;

  return (
    <div className="flex flex-col items-center justify-center h-16 w-32 gap-1.5 bg-background border-2 border-primary rounded-lg shadow-lg cursor-grabbing">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-[10px] font-medium">{fieldConfig.label}</span>
    </div>
  );
}
