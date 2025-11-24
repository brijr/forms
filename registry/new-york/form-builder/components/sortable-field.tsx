"use client";

import { GripVertical } from "lucide-react";
import { FieldActions } from "./field-actions";
import { FieldPreview } from "./field-preview";
import { FieldEditor } from "./field-editor";
import { FieldHeader } from "./field-header";
import { InlineEdit } from "@/registry/new-york/inline-edit/inline-edit";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CSS } from "@dnd-kit/utilities";

import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";

import {
  FieldConfig,
  SelectFieldConfig,
  CheckboxGroupFieldConfig,
  RadioFieldConfig,
} from "@/registry/new-york/form-builder/lib/form-config";
import {
  supportsPlaceholder,
  supportsRequired,
  hasOptions,
} from "@/registry/new-york/form-builder/lib/form-utils";

interface SortableFieldProps {
  field: FieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate?: (e: React.MouseEvent) => void;
  onUpdate: (field: FieldConfig) => void;
}

export function SortableField({
  field,
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
        className="opacity-50 h-24 border-2 border-dashed border-primary/50 rounded-md bg-muted/50"
      />
    );
  }

  return (
    <section>
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        {/* Field Box */}
        <div
          ref={setNodeRef}
          style={style}
          onClick={() => onSelect()}
          className="relative group flex items-start gap-3 p-4 flex-1 border bg-muted/10 rounded h-full"
        >
          {/* Content */}
          <div className="flex-1 space-y-3">
            <FieldHeader
              field={field}
              onLabelUpdate={handleLabelUpdate}
              onDescriptionUpdate={handleDescriptionUpdate}
            />

            {/* Render Preview */}
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

            {/* Required Checkbox */}
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
                  className="text-[10px] font-normal cursor-pointer"
                >
                  Required
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* Actions Column */}
        <div className="flex flex-col gap-0.5 p-1 border bg-muted/30 rounded">
          <Button
            variant="ghost"
            size="icon"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical />
          </Button>

          <FieldActions
            onSettingsClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
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
