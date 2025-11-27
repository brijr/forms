"use client";

import { FIELD_TYPES, CATEGORIES, FieldType } from "./lib/form-config";
import { DraggableToolboxItem } from "./draggable-toolbox-item";

interface FieldToolboxProps {
  onAddField: (type: FieldType) => void;
}

export function FieldToolbox({ onAddField }: FieldToolboxProps) {
  return (
    <div className="overflow-y-auto p-4 space-y-6">
      <h2 className="sr-only">Fields</h2>
      {CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground px-1 uppercase tracking-wider">
            {category.label}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {FIELD_TYPES.filter((f) => f.category === category.id).map(
              (item) => (
                <DraggableToolboxItem
                  key={item.type}
                  fieldType={item}
                  onAddField={onAddField}
                />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
