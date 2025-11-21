"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { XIcon } from "lucide-react";
import type { FieldConfig } from "@/lib/form-config";

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

  const supportsMinMax =
    localField.type === "number" || localField.type === "slider";

  const supportsLength =
    localField.type === "text" ||
    localField.type === "email" ||
    localField.type === "textarea";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Validation Settings</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <FieldGroup className="space-y-4 pt-2">
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
    </div>
  );
}
