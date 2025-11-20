"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { XIcon, PlusIcon, Trash2Icon } from "lucide-react"
import type { FieldConfig, FieldOption } from "@/lib/form-config"

interface FieldEditorProps {
  field: FieldConfig
  onUpdate: (field: FieldConfig) => void
  onClose: () => void
}

export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const [localField, setLocalField] = useState(field)

  const handleUpdate = (updates: Partial<FieldConfig>) => {
    const updated = { ...localField, ...updates }
    setLocalField(updated)
    onUpdate(updated)
  }

  const handleValidationUpdate = (validationUpdates: Partial<NonNullable<FieldConfig["validation"]>>) => {
    handleUpdate({
      validation: {
        ...localField.validation,
        ...validationUpdates,
      },
    })
  }

  const handleOptionUpdate = (index: number, updates: Partial<FieldOption>) => {
    if ("options" in localField) {
      const newOptions = [...localField.options]
      newOptions[index] = { ...newOptions[index], ...updates }
      handleUpdate({ options: newOptions } as Partial<FieldConfig>)
    }
  }

  const handleAddOption = () => {
    if ("options" in localField) {
      const newOptions = [
        ...localField.options,
        {
          label: `Option ${localField.options.length + 1}`,
          value: `option${localField.options.length + 1}`,
        },
      ]
      handleUpdate({ options: newOptions } as Partial<FieldConfig>)
    }
  }

  const handleRemoveOption = (index: number) => {
    if ("options" in localField && localField.options.length > 1) {
      const newOptions = localField.options.filter((_, i) => i !== index)
      handleUpdate({ options: newOptions } as Partial<FieldConfig>)
    }
  }

  const hasOptions =
    localField.type === "select" ||
    localField.type === "radio" ||
    localField.type === "checkbox-group"

  const supportsMinMax =
    localField.type === "number" || localField.type === "slider"

  const supportsLength =
    localField.type === "text" ||
    localField.type === "email" ||
    localField.type === "textarea"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Field Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <FieldGroup className="space-y-6">
        {/* Basic Settings */}
        <Field>
          <FieldLabel htmlFor="field-label">Label</FieldLabel>
          <Input
            id="field-label"
            value={localField.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            placeholder="Field label"
            className="font-normal"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="field-name">Name</FieldLabel>
          <Input
            id="field-name"
            value={localField.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            placeholder="fieldName"
            className="font-normal"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="field-placeholder">Placeholder</FieldLabel>
          <Input
            id="field-placeholder"
            value={localField.placeholder || ""}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            className="font-normal"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="field-description">Description</FieldLabel>
          <Textarea
            id="field-description"
            value={localField.description || ""}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Optional helper text"
            rows={2}
            className="font-normal"
          />
        </Field>

        {/* Field Type Specific Settings */}
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
              className="font-normal"
            />
          </Field>
        )}

        {localField.type === "slider" && (
          <>
            <Field>
              <FieldLabel htmlFor="slider-min">Minimum Value</FieldLabel>
              <Input
                id="slider-min"
                type="number"
                value={localField.min ?? 0}
                onChange={(e) =>
                  handleUpdate({ min: parseInt(e.target.value) || 0 })
                }
                className="font-normal"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="slider-max">Maximum Value</FieldLabel>
              <Input
                id="slider-max"
                type="number"
                value={localField.max ?? 100}
                onChange={(e) =>
                  handleUpdate({ max: parseInt(e.target.value) || 100 })
                }
                className="font-normal"
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
                className="font-normal"
              />
            </Field>
          </>
        )}

        {/* Options for select, radio, checkbox-group */}
        {hasOptions && "options" in localField && (
          <Field>
            <div className="flex items-center justify-between mb-3">
              <FieldLabel>Options</FieldLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddOption}
                className="h-8 font-normal"
              >
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {localField.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) =>
                      handleOptionUpdate(index, { label: e.target.value })
                    }
                    placeholder="Label"
                    className="flex-1 font-normal"
                  />
                  <Input
                    value={option.value}
                    onChange={(e) =>
                      handleOptionUpdate(index, { value: e.target.value })
                    }
                    placeholder="Value"
                    className="flex-1 font-normal"
                  />
                  {localField.options.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="text-muted-foreground hover:text-destructive h-9 w-9"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Field>
        )}

        {/* Validation Settings */}
        <div className="space-y-6 pt-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Validation</h4>
          <FieldGroup className="space-y-6">
            <Field orientation="horizontal">
              <Checkbox
                id="field-required"
                checked={localField.validation?.required ?? false}
                onCheckedChange={(checked) =>
                  handleValidationUpdate({ required: checked })
                }
              />
              <FieldLabel htmlFor="field-required" className="font-normal">
                Required field
              </FieldLabel>
            </Field>

            {supportsLength && (
              <>
                <Field>
                  <FieldLabel htmlFor="field-minlength">
                    Minimum Length
                  </FieldLabel>
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
                    placeholder="No minimum"
                    min={0}
                    className="font-normal"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="field-maxlength">
                    Maximum Length
                  </FieldLabel>
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
                    placeholder="No maximum"
                    min={0}
                    className="font-normal"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="field-pattern">
                    Pattern (Regex)
                  </FieldLabel>
                  <Input
                    id="field-pattern"
                    value={localField.validation?.pattern ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({ pattern: e.target.value })
                    }
                    placeholder="e.g., ^[A-Za-z]+$"
                    className="font-normal"
                  />
                </Field>
              </>
            )}

            {supportsMinMax && (
              <>
                <Field>
                  <FieldLabel htmlFor="field-min">Minimum Value</FieldLabel>
                  <Input
                    id="field-min"
                    type="number"
                    value={localField.validation?.min ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({
                        min: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="No minimum"
                    className="font-normal"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="field-max">Maximum Value</FieldLabel>
                  <Input
                    id="field-max"
                    type="number"
                    value={localField.validation?.max ?? ""}
                    onChange={(e) =>
                      handleValidationUpdate({
                        max: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="No maximum"
                    className="font-normal"
                  />
                </Field>
              </>
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
                placeholder="Optional custom validation message"
                rows={2}
                className="font-normal"
              />
            </Field>
          </FieldGroup>
        </div>
      </FieldGroup>
    </div>
  )
}
