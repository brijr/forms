"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FieldConfig, FieldOption } from "@/lib/form-config";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Copy, Settings2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FieldEditor } from "./field-editor";
import { InlineEdit } from "@/components/ui/inline-edit";

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
    if ("options" in field) {
        const newOptions = [...field.options];
        newOptions[index] = { ...newOptions[index], label: val, value: val }; // Simplifying: value = label for inline edit
        onUpdate({ ...field, options: newOptions });
    }
  };

  const handleAddOption = () => {
    if ("options" in field) {
        const newOptions = [
            ...field.options,
            { label: `Option ${field.options.length + 1}`, value: `option${field.options.length + 1}` }
        ];
        onUpdate({ ...field, options: newOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    if ("options" in field && field.options.length > 1) {
        const newOptions = field.options.filter((_, i) => i !== index);
        onUpdate({ ...field, options: newOptions });
    }
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            disabled
            type={field.type}
            placeholder={field.placeholder}
            className="cursor-pointer bg-muted/20"
          />
        );
      case "textarea":
        return (
          <Textarea
            disabled
            placeholder={field.placeholder}
            className="cursor-pointer bg-muted/20"
            rows={field.rows}
          />
        );
      case "select":
        // For inline editing, we'll show a list of editable options instead of the dropdown
        // The dropdown is good for preview, but bad for editing.
        // Let's show "Select Options:" followed by editable list.
        return (
          <div className="space-y-2">
            <div className="border rounded-md p-2 bg-muted/10 space-y-2">
                 <p className="text-xs text-muted-foreground uppercase font-semibold">Dropdown Options</p>
                 {field.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 group/option">
                        <span className="text-sm text-muted-foreground w-4 text-center">{idx + 1}.</span>
                        <InlineEdit
                            value={opt.label}
                            onSave={(val) => handleOptionUpdate(idx, val)}
                            className="flex-1 text-sm bg-background border border-transparent hover:border-border px-2 py-1"
                        />
                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover/option:opacity-100 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOption(idx);
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                 ))}
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddOption();
                    }}
                    className="h-7 text-xs text-muted-foreground"
                >
                    <Plus className="h-3 w-3 mr-1" /> Add Option
                 </Button>
            </div>
          </div>
        );
      case "checkbox-group":
        return (
          <div className="space-y-2">
            {field.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 group/option">
                <Checkbox disabled id={`${field.id}-${idx}`} />
                <InlineEdit
                    value={opt.label}
                    onSave={(val) => handleOptionUpdate(idx, val)}
                    className="flex-1 text-sm"
                />
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover/option:opacity-100 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOption(idx);
                    }}
                >
                    <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
             <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddOption();
                }}
                className="h-7 text-xs text-muted-foreground ml-6"
            >
                <Plus className="h-3 w-3 mr-1" /> Add Option
            </Button>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
             {field.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 group/option">
                <RadioGroupItem value={opt.value} id={`${field.id}-${idx}`} disabled />
                <InlineEdit
                    value={opt.label}
                    onSave={(val) => handleOptionUpdate(idx, val)}
                    className="flex-1 text-sm"
                />
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover/option:opacity-100 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOption(idx);
                    }}
                >
                    <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
             <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddOption();
                }}
                className="h-7 text-xs text-muted-foreground ml-6"
            >
                <Plus className="h-3 w-3 mr-1" /> Add Option
            </Button>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled id={field.id} />
             {/* Note: Checkbox label usually is the field label itself, handling that below */}
            <Label htmlFor={field.id} className="text-muted-foreground">(Check Label above)</Label>
          </div>
        );
      case "switch":
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.id} className="text-muted-foreground">(Switch Label above)</Label>
            <Switch disabled id={field.id} />
          </div>
        );
      case "slider":
        return (
          <div className="space-y-2">
            <Slider
              disabled
              min={field.min}
              max={field.max}
              step={field.step}
              defaultValue={[field.defaultValue as number]}
            />
             <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{field.min}</span>
                <span>{field.max}</span>
            </div>
          </div>
        );
      default:
        return <div>Unsupported field type</div>;
    }
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
            "relative group p-4 border rounded-lg bg-background shadow-lg ring-1 ring-primary/20",
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
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect()}
      className={cn(
        "relative group flex items-start gap-3 p-4 border rounded-lg bg-background transition-all hover:shadow-sm",
        isSelected ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-1 -ml-1 p-1 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-foreground transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        {field.type !== "checkbox" && field.type !== "switch" && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
                 <InlineEdit
                    value={field.label}
                    onSave={(val) => onUpdate({ ...field, label: val })}
                    className="font-medium text-sm text-foreground"
                    placeholder="Field Label"
                />
                {field.validation?.required && (
                    <span className="text-destructive text-sm">*</span>
                )}
            </div>

             <InlineEdit
                value={field.description || ""}
                onSave={(val) => onUpdate({ ...field, description: val })}
                className="text-xs text-muted-foreground"
                placeholder="Description (optional)"
            />
          </div>
        )}

        {/* Render Preview */}
        <div className=""> {/* Removed pointer-events-none to allow interaction with inline edits */}
            {renderFieldPreview()}
        </div>

        {/* Inline Placeholder Edit (only for inputs) */}
        {(field.type === "text" || field.type === "email" || field.type === "number" || field.type === "textarea") && (
             <div className="pt-1">
                <InlineEdit
                    value={field.placeholder || ""}
                    onSave={(val) => onUpdate({ ...field, placeholder: val })}
                    className="text-xs text-muted-foreground/60 italic"
                    placeholder="Edit placeholder..."
                />
             </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
