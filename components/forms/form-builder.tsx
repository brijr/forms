"use client";

import { useState } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TypeIcon,
  MailIcon,
  PhoneIcon,
  HashIcon,
  AlignLeftIcon,
  ChevronDownCircleIcon,
  CheckSquareIcon,
  CircleDotIcon,
  SquareCheckIcon,
  ToggleRightIcon,
  SlidersHorizontalIcon,
  Upload,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { FormConfig, FieldType, FieldConfig } from "@/lib/form-config";
import { createDefaultField, createEmptyForm } from "@/lib/form-config";
import { downloadFormConfig, parseFormConfig } from "@/lib/form-utils";
import { FormRenderer } from "./form-renderer";
import { SortableField } from "./sortable-field";

type ToolboxItem = {
  type: FieldType;
  label: string;
  icon: React.ElementType;
};

const TOOLBOX_CATEGORIES: { name: string; items: ToolboxItem[] }[] = [
  {
    name: "Basic Fields",
    items: [
      { type: "text", label: "Text", icon: TypeIcon },
      { type: "email", label: "Email", icon: MailIcon },
      { type: "phone", label: "Phone", icon: PhoneIcon },
      { type: "number", label: "Number", icon: HashIcon },
      { type: "textarea", label: "Textarea", icon: AlignLeftIcon },
    ],
  },
  {
    name: "Selection & Choice",
    items: [
      { type: "select", label: "Select", icon: ChevronDownCircleIcon },
      { type: "radio", label: "Radio", icon: CircleDotIcon },
      { type: "yes-no", label: "Yes/No", icon: CircleDotIcon },
      { type: "checkbox-group", label: "Checkboxes", icon: CheckSquareIcon },
      { type: "checkbox", label: "Checkbox", icon: SquareCheckIcon },
      { type: "switch", label: "Switch", icon: ToggleRightIcon },
      { type: "slider", label: "Slider", icon: SlidersHorizontalIcon },
    ],
  },
];

export function FormBuilder() {
  const [formConfig, setFormConfig] = useState<FormConfig>(createEmptyForm());
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"builder" | "preview" | "json">(
    "builder"
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddField = (type: FieldType) => {
    const newField = createDefaultField(type, formConfig.fields.length);
    setFormConfig({
      ...formConfig,
      fields: [...formConfig.fields, newField],
    });
    setSelectedFieldId(newField.id);

    // Show toast notification
    toast.success("Field added", {
      description: `${type} field added to the form`,
    });
  };

  const handleDeleteField = (fieldId: string) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.filter((f) => f.id !== fieldId),
    });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleDuplicateField = (fieldId: string) => {
    const fieldToDuplicate = formConfig.fields.find((f) => f.id === fieldId);
    if (!fieldToDuplicate) return;

    const newField = {
      ...fieldToDuplicate,
      id: `field_${crypto.randomUUID()}`,
      name: `${fieldToDuplicate.name}_copy`,
      label: `${fieldToDuplicate.label} (Copy)`,
    };

    const index = formConfig.fields.findIndex((f) => f.id === fieldId);
    const newFields = [...formConfig.fields];
    newFields.splice(index + 1, 0, newField);

    setFormConfig({
      ...formConfig,
      fields: newFields,
    });
    setSelectedFieldId(newField.id);
    toast.success("Field duplicated");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFormConfig((prev) => {
        const oldIndex = prev.fields.findIndex((f) => f.id === active.id);
        const newIndex = prev.fields.findIndex((f) => f.id === over?.id);

        return {
          ...prev,
          fields: arrayMove(prev.fields, oldIndex, newIndex),
        };
      });
    }
  };

  const handleUpdateField = (updatedField: FieldConfig) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((f) =>
        f.id === updatedField.id ? updatedField : f
      ),
    });
  };

  const handleExport = () => {
    downloadFormConfig(formConfig);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const jsonString = event.target?.result as string;
          const config = parseFormConfig(jsonString);
          if (config) {
            setFormConfig(config);
            setSelectedFieldId(null);
          } else {
            alert("Invalid form configuration file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Floating Controls */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
          <div className="flex bg-background/95 backdrop-blur-sm border rounded-lg p-1">
            <Button
              variant={viewMode === "builder" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("builder")}
              className="h-8"
            >
              Builder
            </Button>
            <Button
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="h-8"
            >
              Preview
            </Button>
            <Button
              variant={viewMode === "json" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("json")}
              className="h-8"
            >
              JSON
            </Button>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleImport}>
                  <Upload />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {viewMode === "builder" && (
          <>
            {/* Left Sidebar - Toolbox */}
            <div className="w-64 overflow-y-auto border-r bg-muted/10 p-4">
              <div className="space-y-6">
                <h2 className="sr-only">Fields</h2>
                {TOOLBOX_CATEGORIES.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground px-1 uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((item) => (
                        <Button
                          key={item.type}
                          variant="outline"
                          className="flex flex-col items-center justify-center h-16 w-full gap-1.5 whitespace-normal px-2 py-3 text-xs hover:border-primary hover:text-primary transition-all [&>svg]:shrink-0"
                          onClick={() => handleAddField(item.type)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-[10px] font-medium leading-tight text-center">
                            {item.label}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Canvas */}
            <div className="flex-1 overflow-y-auto bg-muted/20 p-8">
              <div className="mx-auto max-w-3xl min-h-full">
                <div className="flex-1 mb-6">
                  <Input
                    value={formConfig.title}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, title: e.target.value })
                    }
                    placeholder="Form Title"
                    className="p-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                  />
                  <Input
                    value={formConfig.description || ""}
                    onChange={(e) =>
                      setFormConfig({
                        ...formConfig,
                        description: e.target.value,
                      })
                    }
                    placeholder="Form description"
                    className="p-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                  />
                </div>
                {formConfig.fields.length === 0 ? (
                  <div className="flex items-center justify-center p-8 border rounded">
                    <p className="text-sm text-muted-foreground">
                      Add a field to begin
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formConfig.fields.map((f) => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4 pb-20">
                        {formConfig.fields.map((field) => (
                          <SortableField
                            key={field.id}
                            field={field}
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onDelete={() => handleDeleteField(field.id)}
                            onDuplicate={() => handleDuplicateField(field.id)}
                            onUpdate={handleUpdateField}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </>
        )}

        {viewMode === "preview" && (
          <div className="flex-1 overflow-y-auto bg-muted/20 p-8">
            <div className="mx-auto max-w-2xl">
              <FormRenderer config={formConfig} />
            </div>
          </div>
        )}

        {viewMode === "json" && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-lg border bg-muted/30 p-6">
                <pre className="text-sm overflow-x-auto leading-relaxed font-mono">
                  {JSON.stringify(formConfig, null, 2)}
                </pre>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(formConfig, null, 2)
                  );
                  toast.success("Copied to clipboard");
                }}
                variant="outline"
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
