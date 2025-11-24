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
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
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

const FIELD_TYPES = [
  { type: "text", label: "Text", icon: TypeIcon, category: "basic" },
  { type: "email", label: "Email", icon: MailIcon, category: "basic" },
  { type: "phone", label: "Phone", icon: PhoneIcon, category: "basic" },
  { type: "number", label: "Number", icon: HashIcon, category: "basic" },
  {
    type: "textarea",
    label: "Textarea",
    icon: AlignLeftIcon,
    category: "basic",
  },
  {
    type: "select",
    label: "Select",
    icon: ChevronDownCircleIcon,
    category: "choice",
  },
  { type: "radio", label: "Radio", icon: CircleDotIcon, category: "choice" },
  { type: "yes-no", label: "Yes/No", icon: CircleDotIcon, category: "choice" },
  {
    type: "checkbox-group",
    label: "Checkboxes",
    icon: CheckSquareIcon,
    category: "choice",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: SquareCheckIcon,
    category: "choice",
  },
  {
    type: "switch",
    label: "Switch",
    icon: ToggleRightIcon,
    category: "choice",
  },
  {
    type: "slider",
    label: "Slider",
    icon: SlidersHorizontalIcon,
    category: "choice",
  },
] as const;

const CATEGORIES = [
  { id: "basic", label: "Basic Fields" },
  { id: "choice", label: "Selection & Choice" },
];

type ViewMode = "builder" | "preview" | "json";

export function FormBuilder() {
  const [formConfig, setFormConfig] = useState<FormConfig>(createEmptyForm());
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("builder");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addField = (type: FieldType) => {
    const newField = createDefaultField(type, formConfig.fields.length);
    setFormConfig((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedFieldId(newField.id);
    toast.success("Field added", {
      description: `${type} field added to the form`,
    });
  };

  const deleteField = (fieldId: string) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    }));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const duplicateField = (fieldId: string) => {
    const field = formConfig.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const newField = {
      ...field,
      id: `field_${crypto.randomUUID()}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
    };

    setFormConfig((prev) => {
      const index = prev.fields.findIndex((f) => f.id === fieldId);
      const fields = [...prev.fields];
      fields.splice(index + 1, 0, newField);
      return { ...prev, fields };
    });
    setSelectedFieldId(newField.id);
    toast.success("Field duplicated");
  };

  const updateField = (updatedField: FieldConfig) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === updatedField.id ? updatedField : f
      ),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) return;

    setFormConfig((prev) => {
      const oldIndex = prev.fields.findIndex((f) => f.id === active.id);
      const newIndex = prev.fields.findIndex((f) => f.id === over?.id);
      return { ...prev, fields: arrayMove(prev.fields, oldIndex, newIndex) };
    });
  };

  const handleExport = () => downloadFormConfig(formConfig);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const config = parseFormConfig(event.target?.result as string);
        if (config) {
          setFormConfig(config);
          setSelectedFieldId(null);
        } else {
          alert("Invalid form configuration file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="relative h-full w-full">
      <SidebarProvider
        defaultOpen
        className="h-full min-h-0! **:data-[slot=sidebar-container]:absolute! **:data-[slot=sidebar-container]:h-full! **:data-[slot=sidebar-container]:inset-y-0!"
      >
        <div className="flex h-full w-full relative">
          {/* Floating Controls */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
            {viewMode === "builder" && (
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            )}
            <div className="flex bg-background/95 backdrop-blur-sm border rounded-lg p-1">
              {(["builder", "preview", "json"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="h-8 capitalize"
                >
                  {mode}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleImport}>
                    <Upload />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExport}>
                    <Download />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Sidebar Toolbox */}
          <Sidebar side="left" collapsible="offcanvas">
            {viewMode === "builder" && (
              <div className="overflow-y-auto p-4 space-y-6">
                <h2 className="sr-only">Fields</h2>
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground px-1 uppercase tracking-wider">
                      {category.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {FIELD_TYPES.filter(
                        (f) => f.category === category.id
                      ).map((item) => (
                        <Button
                          key={item.type}
                          variant="outline"
                          className="flex flex-col items-center justify-center h-16 w-full gap-1.5 whitespace-normal px-2 py-3 text-xs hover:border-primary hover:text-primary transition-all [&>svg]:shrink-0"
                          onClick={() => addField(item.type)}
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
            )}
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="flex-1 overflow-y-auto bg-muted/20 p-8 w-full">
            {/* Builder Mode */}
            {viewMode === "builder" && (
              <div className="mx-auto max-w-4xl min-h-full">
                <div className="mb-6">
                  <Input
                    value={formConfig.title}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Form Title"
                    className="p-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                  />
                  <Input
                    value={formConfig.description || ""}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
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
                            onDelete={() => deleteField(field.id)}
                            onDuplicate={() => duplicateField(field.id)}
                            onUpdate={updateField}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}

            {/* Preview Mode */}
            {viewMode === "preview" && (
              <div className="mx-auto max-w-2xl">
                <FormRenderer config={formConfig} />
              </div>
            )}

            {/* JSON Mode */}
            {viewMode === "json" && (
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
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
