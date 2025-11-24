"use client";

import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { toast } from "sonner";
import type { FormConfig, FieldType, FieldConfig } from "@/lib/form-config";
import { createDefaultField, createEmptyForm } from "@/lib/form-config";
import { downloadFormConfig, parseFormConfig } from "@/lib/form-utils";

export type ViewMode = "builder" | "preview" | "json";

export function useFormBuilder() {
  const [formConfig, setFormConfig] = useState<FormConfig>(createEmptyForm());
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("builder");

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

  const updateFormConfig = (updates: Partial<FormConfig>) => {
    setFormConfig((prev) => ({ ...prev, ...updates }));
  };

  return {
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
  };
}
