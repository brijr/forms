"use client";

import {
  GripVertical,
  MoreHorizontal,
  Settings2,
  Copy,
  Trash2,
} from "lucide-react";
import { FieldPreview } from "./field-preview";
import { FieldEditor } from "./field-editor";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import {
  FieldConfig,
  FieldType,
  SelectFieldConfig,
  CheckboxGroupFieldConfig,
  RadioFieldConfig,
  FIELD_TYPES,
} from "./lib/form-config";
import {
  supportsPlaceholder,
  supportsRequired,
  hasOptions,
} from "./lib/form-utils";
import { cn } from "@/lib/utils";

interface SortableFieldProps {
  field: FieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate?: (e: React.MouseEvent) => void;
  onUpdate: (field: FieldConfig) => void;
}

function FieldTypeIcon({ type }: { type: FieldType }) {
  const fieldType = FIELD_TYPES.find((f) => f.type === type);
  if (!fieldType) return null;
  const Icon = fieldType.icon;
  return <Icon className="h-3 w-3" />;
}

export function SortableField({
  field,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
}: SortableFieldProps) {
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

  const handleOptionUpdate = (index: number, val: string) => {
    if (hasOptions(field.type)) {
      const fieldWithOptions = field as
        | SelectFieldConfig
        | CheckboxGroupFieldConfig
        | RadioFieldConfig;
      const newOptions = [...fieldWithOptions.options];
      newOptions[index] = { ...newOptions[index], label: val, value: val };
      onUpdate({ ...fieldWithOptions, options: newOptions });
    }
  };

  const handleAddOption = () => {
    if (hasOptions(field.type)) {
      const fieldWithOptions = field as
        | SelectFieldConfig
        | CheckboxGroupFieldConfig
        | RadioFieldConfig;
      const newOptions = [
        ...fieldWithOptions.options,
        {
          label: `Option ${fieldWithOptions.options.length + 1}`,
          value: `option${fieldWithOptions.options.length + 1}`,
        },
      ];
      onUpdate({ ...fieldWithOptions, options: newOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (hasOptions(field.type)) {
      const fieldWithOptions = field as
        | SelectFieldConfig
        | CheckboxGroupFieldConfig
        | RadioFieldConfig;
      if (fieldWithOptions.options.length > 1) {
        const newOptions = fieldWithOptions.options.filter(
          (_, i: number) => i !== index
        );
        onUpdate({ ...fieldWithOptions, options: newOptions });
      }
    }
  };

  const handleLabelUpdate = (val: string) => {
    onUpdate({ ...field, label: val });
  };

  const handleDescriptionUpdate = (val: string) => {
    onUpdate({ ...field, description: val });
  };

  const handlePlaceholderUpdate = (val: string) => {
    onUpdate({ ...field, placeholder: val });
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 h-24 border-2 border-dashed border-primary/50 rounded-lg bg-muted/50"
      />
    );
  }

  return (
    <section>
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => onSelect()}
        className={cn(
          "border rounded-lg transition-all overflow-hidden",
          isSelected
            ? "border-primary/50 shadow-sm"
            : "border-border hover:border-primary/30"
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 border-b">
          {/* Drag Handle + Type Badge */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3.5 w-3.5" />
            </Button>
            <FieldTypeIcon type={field.type} />
            <span className="text-[10px] font-medium uppercase tracking-wide">
              {field.type}
            </span>
          </div>

          {/* Options Menu */}
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Settings2 className="mr-2 h-4 w-4" />
                  Validation Settings
                </DropdownMenuItem>
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Field Content */}
        <div className="p-4 space-y-3">
          {/* Label & Description (for most field types) */}
          {field.type !== "checkbox" && field.type !== "switch" && (
            <div className="space-y-1">
              <InlineEdit
                value={field.label}
                onSave={handleLabelUpdate}
                className="font-medium text-base text-foreground"
                placeholder="Field Label"
              />
              <InlineEdit
                value={field.description || ""}
                onSave={handleDescriptionUpdate}
                className="text-sm text-muted-foreground"
                placeholder="Description"
              />
            </div>
          )}

          {/* Field Preview */}
          <div className="relative">
            <FieldPreview
              field={field}
              onOptionUpdate={handleOptionUpdate}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
              onLabelUpdate={handleLabelUpdate}
            />

            {/* Inline Placeholder Edit */}
            {supportsPlaceholder(field.type) && (
              <div
                className={`absolute left-3 pointer-events-none ${
                  field.type === "textarea"
                    ? "top-2"
                    : "top-0 h-9 flex items-center"
                }`}
              >
                <div className="pointer-events-auto">
                  <InlineEdit
                    value={field.placeholder || ""}
                    onSave={handlePlaceholderUpdate}
                    className="text-muted-foreground font-normal"
                    placeholder="Placeholder"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Required Toggle */}
          {supportsRequired(field.type) && (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                id={`${field.id}-required`}
                checked={field.validation?.required ?? false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    ...field,
                    validation: {
                      ...field.validation,
                      required: checked === true,
                    },
                  })
                }
              />
              <Label
                htmlFor={`${field.id}-required`}
                className="text-xs font-normal cursor-pointer text-muted-foreground"
              >
                Required
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Validation Settings Dialog */}
      <FieldEditor
        field={field}
        onUpdate={onUpdate}
        onClose={() => setIsEditing(false)}
        open={isEditing}
      />
    </section>
  );
}
