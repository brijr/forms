"use client";

import { FieldConfig, SelectFieldConfig, CheckboxGroupFieldConfig, RadioFieldConfig, SliderFieldConfig } from "../lib/form-config";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Plus, X } from "lucide-react";
import { OptionList } from "./option-list";

interface FieldPreviewProps {
  field: FieldConfig;
  onOptionUpdate: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onLabelUpdate: (value: string) => void;
}

export function FieldPreview({
  field,
  onOptionUpdate,
  onAddOption,
  onRemoveOption,
  onLabelUpdate,
}: FieldPreviewProps) {
  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "number":
      return (
        <Input
          disabled
          type={field.type === "phone" ? "tel" : field.type}
          className="cursor-pointer bg-muted/20"
        />
      );

    case "textarea":
      return (
        <Textarea
          disabled
          className="cursor-pointer bg-muted/20"
          rows={field.rows}
        />
      );

    case "select": {
      const selectField = field as SelectFieldConfig;
      return (
        <OptionList
          options={selectField.options}
          fieldId={selectField.id}
          onOptionUpdate={onOptionUpdate}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
        />
      );
    }

    case "checkbox-group": {
      const checkboxGroupField = field as CheckboxGroupFieldConfig;
      return (
        <div className="space-y-2">
          {checkboxGroupField.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 group/option">
              <Checkbox disabled id={`${field.id}-${idx}`} />
              <InlineEdit
                value={opt.label}
                onSave={(val) => onOptionUpdate(idx, val)}
                className="flex-1 text-base"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover/option:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveOption(idx);
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
              onAddOption();
            }}
            className="h-7 text-xs text-muted-foreground"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Option
          </Button>
        </div>
      );
    }

    case "radio": {
      const radioField = field as RadioFieldConfig;
      return (
        <RadioGroup disabled>
          <div className="space-y-2">
            {radioField.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 group/option">
                <RadioGroupItem value={opt.value} id={`${field.id}-${idx}`} />
                <InlineEdit
                  value={opt.label}
                  onSave={(val) => onOptionUpdate(idx, val)}
                  className="flex-1 text-base"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover/option:opacity-100 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveOption(idx);
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
                onAddOption();
              }}
              className="h-7 text-xs text-muted-foreground"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Option
            </Button>
          </div>
        </RadioGroup>
      );
    }

    case "yes-no":
      return (
        <div className="flex gap-2">
          <Button variant="outline" disabled className="flex-1 py-6">
            Yes
          </Button>
          <Button variant="outline" disabled className="flex-1 py-6">
            No
          </Button>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox disabled id={field.id} />
          <InlineEdit
            value={field.label}
            onSave={onLabelUpdate}
            placeholder="Checkbox label"
          />
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center justify-between">
          <InlineEdit
            value={field.label}
            onSave={onLabelUpdate}
            placeholder="Switch label"
          />
          <Switch disabled id={field.id} />
        </div>
      );

    case "slider": {
      const sliderField = field as SliderFieldConfig;
      return (
        <div className="space-y-2">
          <Slider
            disabled
            min={sliderField.min}
            max={sliderField.max}
            step={sliderField.step}
            defaultValue={[sliderField.defaultValue as number]}
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>{sliderField.min}</span>
            <span>{sliderField.max}</span>
          </div>
        </div>
      );
    }

    default:
      return <div>Unsupported field type</div>;
  }
}
