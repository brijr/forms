"use client";

import { Button } from "@/components/ui/button";
import { FIELD_TYPES, CATEGORIES, FieldType } from "@/lib/form-builder/form-config";

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
                <Button
                  key={item.type}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-16 w-full gap-1.5 whitespace-normal px-2 py-3 text-xs hover:border-primary hover:text-primary transition-all [&>svg]:shrink-0"
                  onClick={() => onAddField(item.type)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-tight text-center">
                    {item.label}
                  </span>
                </Button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
