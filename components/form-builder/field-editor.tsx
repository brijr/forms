"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { XIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FieldConfig, FieldOption } from "@/lib/form-config";

interface FieldEditorProps {
  field: FieldConfig;
  onUpdate: (field: FieldConfig) => void;
  onClose: () => void;
}

export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const [localField, setLocalField] = useState(field);

  const handleUpdate = (updates: Partial<FieldConfig>) => {
    const updated = { ...localField, ...updates } as FieldConfig;
    setLocalField(updated);
    onUpdate(updated);
  };

  const handleValidationUpdate = (
    validationUpdates: Partial<NonNullable<FieldConfig["validation"]>>
  ) => {
    handleUpdate({
      validation: {
        ...localField.validation,
        ...validationUpdates,
      },
    });
  };

  const handleOptionUpdate = (index: number, updates: Partial<FieldOption>) => {
    if ("options" in localField) {
      const newOptions = [...localField.options];
      newOptions[index] = { ...newOptions[index], ...updates };
      handleUpdate({ options: newOptions } as Partial<FieldConfig>);
    }
  };

  const handleAddOption = () => {
    if ("options" in localField) {
      const newOptions = [
        ...localField.options,
        {
          label: `Option ${localField.options.length + 1}`,
          value: `option${localField.options.length + 1}`,
        },
      ];
      handleUpdate({ options: newOptions } as Partial<FieldConfig>);
    }
  };

  const handleRemoveOption = (index: number) => {
    if ("options" in localField && localField.options.length > 1) {
      const newOptions = localField.options.filter((_, i) => i !== index);
      handleUpdate({ options: newOptions } as Partial<FieldConfig>);
    }
  };

  const hasOptions =
    localField.type === "select" ||
    localField.type === "radio" ||
    localField.type === "checkbox-group";

  const supportsMinMax =
    localField.type === "number" || localField.type === "slider";

  const supportsLength =
    localField.type === "text" ||
    localField.type === "email" ||
    localField.type === "textarea";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Field Settings</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="options" disabled={!hasOptions}>
            Options
          </TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="field-label">Label</FieldLabel>
              <Input
                id="field-label"
                value={localField.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                placeholder="Field label"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="field-name">Name (ID)</FieldLabel>
              <Input
                id="field-name"
                value={localField.name}
                onChange={(e) => handleUpdate({ name: e.target.value })}
                placeholder="fieldName"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="field-placeholder">Placeholder</FieldLabel>
              <Input
                id="field-placeholder"
                value={localField.placeholder || ""}
                onChange={(e) => handleUpdate({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="field-description">Helper Text</FieldLabel>
              <Textarea
                id="field-description"
                value={localField.description || ""}
                onChange={(e) => handleUpdate({ description: e.target.value })}
                placeholder="Optional helper text"
                rows={2}
              />
            </Field>

            {localField.type === "textarea" && (
              <Field>
                <FieldLabel htmlFor="field-rows">Rows</FieldLabel>
                <Input
                  id="field-rows"
                  type="number"
                  value={localField.rows || 4}
                  onChange={(e) =>
                    handleUpdate({ rows: parseInt(e.target.value) || 4 })
                  }
                  min={1}
                  max={20}
                />
              </Field>
            )}

            {localField.type === "slider" && (
              <div className="grid grid-cols-3 gap-2">
                <Field>
                  <FieldLabel htmlFor="slider-min">Min</FieldLabel>
                  <Input
                    id="slider-min"
                    type="number"
                    value={localField.min ?? 0}
                    onChange={(e) =>
                      handleUpdate({ min: parseInt(e.target.value) || 0 })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="slider-max">Max</FieldLabel>
                  <Input
                    id="slider-max"
                    type="number"
                    value={localField.max ?? 100}
                    onChange={(e) =>
                      handleUpdate({ max: parseInt(e.target.value) || 100 })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="slider-step">Step</FieldLabel>
                  <Input
                    id="slider-step"
                    type="number"
                    value={localField.step ?? 1}
                    onChange={(e) =>
                      handleUpdate({ step: parseInt(e.target.value) || 1 })
                    }
                    min={1}
                  />
                </Field>
              </div>
            )}
          </FieldGroup>
        </TabsContent>

        <TabsContent value="options" className="space-y-4 pt-4">
          {hasOptions && "options" in localField && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Options List</FieldLabel>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="h-8"
                >
                  <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {localField.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      value={option.label}
                      onChange={(e) =>
                        handleOptionUpdate(index, { label: e.target.value })
                      }
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      value={option.value}
                      onChange={(e) =>
                        handleOptionUpdate(index, { value: e.target.value })
                      }
                      placeholder="Value"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={localField.options.length <= 1}
                      onClick={() => handleRemoveOption(index)}
                      className="text-muted-foreground hover:text-destructive h-9 w-9 shrink-0"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4 pt-4">
          <FieldGroup className="space-y-4">
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <Checkbox
                id="field-required"
                checked={localField.validation?.required ?? false}
                onCheckedChange={(checked) =>
                  handleValidationUpdate({ required: checked === true })
                }
              />
              <label
                htmlFor="field-required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Required Field
              </label>
            </div>

            {supportsLength && (
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="field-minlength">Min Length</FieldLabel>
                  <Input
                    id="field-minlength"
                    type="number"
                    value={localField.validation?.minLength ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({
                        minLength: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="None"
                    min={0}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="field-maxlength">Max Length</FieldLabel>
                  <Input
                    id="field-maxlength"
                    type="number"
                    value={localField.validation?.maxLength ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({
                        maxLength: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="None"
                    min={0}
                  />
                </Field>
              </div>
            )}

            {supportsLength && (
              <Field>
                <FieldLabel htmlFor="field-pattern">Regex Pattern</FieldLabel>
                <Input
                  id="field-pattern"
                  value={localField.validation?.pattern ?? ""}
                  onChange={(e) =>
                    handleValidationUpdate({ pattern: e.target.value })
                  }
                  placeholder="e.g., ^[A-Za-z]+$"
                  className="font-mono text-sm"
                />
              </Field>
            )}

            {supportsMinMax && (
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="val-min">Min Value</FieldLabel>
                  <Input
                    id="val-min"
                    type="number"
                    value={localField.validation?.min ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({
                        min: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="None"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="val-max">Max Value</FieldLabel>
                  <Input
                    id="val-max"
                    type="number"
                    value={localField.validation?.max ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({
                        max: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="None"
                  />
                </Field>
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="field-custom-error">
                Custom Error Message
              </FieldLabel>
              <Textarea
                id="field-custom-error"
                value={localField.validation?.custom ?? ""}
                onChange={(e) =>
                  handleValidationUpdate({ custom: e.target.value })
                }
                placeholder="Message to show when validation fails"
                rows={2}
              />
            </Field>
          </FieldGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
}
