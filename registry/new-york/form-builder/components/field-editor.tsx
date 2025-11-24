"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FieldConfig } from "@/registry/new-york/form-builder/lib/form-config";

interface FieldEditorProps {
  field: FieldConfig;
  onUpdate: (field: FieldConfig) => void;
  onClose: () => void;
  open: boolean;
}

export function FieldEditor({ field, onUpdate, onClose, open }: FieldEditorProps) {
  const [localField, setLocalField] = useState(field);

  // Update local field when prop changes
  useEffect(() => {
    setLocalField(field);
  }, [field]);

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
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validation Settings</DialogTitle>
        </DialogHeader>

      <FieldGroup className="space-y-3">
        {supportsLength && (
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="field-minlength" className="text-base">Min Length</FieldLabel>
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
                className="md:text-base"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="field-maxlength" className="text-base">Max Length</FieldLabel>
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
                className="md:text-base"
              />
            </Field>
          </div>
        )}

        {supportsLength && (
        <Field>
          <FieldLabel htmlFor="field-pattern" className="text-base">Regex Pattern</FieldLabel>
          <Input
              id="field-pattern"
              value={localField.validation?.pattern ?? ""}
              onChange={(e) =>
                handleValidationUpdate({ pattern: e.target.value })
              }
              placeholder="e.g., ^[A-Za-z]+$"
              className="font-mono text-base md:text-base"
            />
          </Field>
        )}

        {supportsMinMax && (
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="val-min" className="text-base">Min Value</FieldLabel>
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
                className="md:text-base"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="val-max" className="text-base">Max Value</FieldLabel>
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
                className="md:text-base"
              />
            </Field>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="field-custom-error" className="text-base">
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
            className="md:text-base"
          />
        </Field>
      </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
