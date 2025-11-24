"use client";

import { FieldConfig, FieldType } from "../lib/form-config";
import { InlineEdit } from "@/components/ui/inline-edit";
import {
  Type,
  Mail,
  Phone,
  Hash,
  AlignLeft,
  ChevronDownCircle,
  CheckSquare,
  CircleDot,
  SquareCheck,
  ToggleRight,
  SlidersHorizontal,
  LucideIcon,
} from "lucide-react";

interface FieldHeaderProps {
  field: FieldConfig;
  onLabelUpdate: (value: string) => void;
  onDescriptionUpdate: (value: string) => void;
}

const FIELD_ICON_MAP: Record<FieldType, LucideIcon> = {
  text: Type,
  email: Mail,
  phone: Phone,
  number: Hash,
  textarea: AlignLeft,
  select: ChevronDownCircle,
  "checkbox-group": CheckSquare,
  radio: CircleDot,
  "yes-no": CircleDot,
  checkbox: SquareCheck,
  switch: ToggleRight,
  slider: SlidersHorizontal,
};

function FieldTypeIcon({
  type,
  className,
}: {
  type: FieldType;
  className?: string;
}) {
  const Icon = FIELD_ICON_MAP[type] || Type;
  return <Icon className={className} />;
}

export function FieldHeader({
  field,
  onLabelUpdate,
  onDescriptionUpdate,
}: FieldHeaderProps) {
  if (field.type === "checkbox" || field.type === "switch") {
    return (
      <div className="flex items-center justify-end gap-2">
        <div
          className="flex items-center gap-2 text-muted-foreground/60"
          title={field.type}
        >
          <FieldTypeIcon type={field.type} className="h-4 w-4" />
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
          <FieldTypeIcon type={field.type} className="h-4 w-4" />
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
