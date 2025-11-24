"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import { useFormBuilder } from "./use-form-builder";
import { FormRenderer } from "./form-renderer";
import { SortableField } from "./sortable-field";
import { FloatingControls } from "./floating-controls";
import { FieldToolbox } from "./field-toolbox";

export function FormBuilder() {
  const {
    formConfig,
    selectedFieldId,
    viewMode,
    setViewMode,
    setSelectedFieldId,
    addField,
    deleteField,
    duplicateField,
    updateField,
    updateFormConfig,
    handleDragEnd,
    handleExport,
    handleImport,
  } = useFormBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div className="relative h-full w-full">
      <SidebarProvider
        defaultOpen
        className="h-full min-h-0! **:data-[slot=sidebar-container]:absolute! **:data-[slot=sidebar-container]:h-full! **:data-[slot=sidebar-container]:inset-y-0!"
      >
        <div className="flex h-full w-full relative">
          <FloatingControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onImport={handleImport}
            onExport={handleExport}
          />

          <Sidebar side="left" collapsible="offcanvas">
            {viewMode === "builder" && <FieldToolbox onAddField={addField} />}
          </Sidebar>

          <SidebarInset className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8 w-full">
            {viewMode === "builder" && (
              <div className="mx-auto w-full max-w-4xl min-h-full">
                {/* Form Header */}
                <div className="mb-8">
                  <input
                    value={formConfig.title}
                    onChange={(e) =>
                      updateFormConfig({ title: e.target.value })
                    }
                    placeholder="Untitled Form"
                    className="w-full bg-transparent text-2xl md:text-3xl font-semibold placeholder:text-muted-foreground/50 focus:outline-none border-none p-0 mb-2"
                  />
                  <input
                    value={formConfig.description || ""}
                    onChange={(e) =>
                      updateFormConfig({ description: e.target.value })
                    }
                    placeholder="Add a description..."
                    className="w-full bg-transparent text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none border-none p-0"
                  />
                </div>

                {/* Fields */}
                {formConfig.fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/10">
                    <MousePointerClick className="h-10 w-10 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground font-medium mb-1">
                      No fields yet
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Click a field type in the sidebar to add it
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

            {viewMode === "preview" && (
              <div className="mx-auto w-full max-w-2xl">
                <FormRenderer config={formConfig} />
              </div>
            )}

            {viewMode === "json" && (
              <div className="mx-auto w-full max-w-4xl space-y-6">
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
