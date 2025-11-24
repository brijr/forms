"use client";

import { FieldOption } from "@/lib/form-config";
import { Button } from "@/components/ui/button";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Plus, X } from "lucide-react";

interface OptionListProps {
  options: FieldOption[];
  fieldId: string;
  onOptionUpdate: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export function OptionList({
  options,
  fieldId,
  onOptionUpdate,
  onAddOption,
  onRemoveOption,
}: OptionListProps) {
  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2 group/option">
          <span className="text-sm text-muted-foreground w-4 text-center">
            {idx + 1}.
          </span>
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
