"use client";

import { FieldConfig } from "@/lib/form-config";
import { InlineEdit } from "@/components/ui/inline-edit";
import { getFieldTypeIcon } from "@/lib/form-utils";
import { LucideIcon } from "lucide-react";

interface FieldHeaderProps {
  field: FieldConfig;
  onLabelUpdate: (value: string) => void;
  onDescriptionUpdate: (value: string) => void;
}

export function FieldHeader({
  field,
  onLabelUpdate,
  onDescriptionUpdate,
}: FieldHeaderProps) {
  const FieldTypeIcon = getFieldTypeIcon(field.type);

  if (field.type === "checkbox" || field.type === "switch") {
    return (
      <div className="flex items-center justify-end gap-2">
        <div
          className="flex items-center gap-2 text-muted-foreground/60"
          title={field.type}
        >
          <FieldTypeIcon className="h-4 w-4" />
          <span className="text-[10px] uppercase">{field.type}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <InlineEdit
          value={field.label}
          onSave={onLabelUpdate}
          className="font-medium text-base text-foreground"
          placeholder="Field Label"
        />
        <div
          className="flex items-center gap-2 text-muted-foreground/60"
          title={field.type}
        >
          <FieldTypeIcon className="h-4 w-4" />
          <span className="text-[10px] uppercase">{field.type}</span>
        </div>
      </div>
      <InlineEdit
        value={field.description || ""}
        onSave={onDescriptionUpdate}
        className="text-muted-foreground"
        placeholder="Description"
      />
    </div>
  );
}
