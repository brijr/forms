"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export function InlineEdit({
  value,
  onSave,
  placeholder = "Click to edit",
  className,
  multiline = false,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempValue, setTempValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("min-h-[60px] resize-none", className)}
          rows={2}
        />
      );
    }
    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("h-8", className)}
      />
    );
  }

  return (
    <div
      onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
      }}
      className={cn(
        "cursor-text hover:bg-muted/50 rounded px-1 -mx-1 transition-colors min-h-[1.5em]",
        !value && "text-muted-foreground italic",
        className
      )}
    >
      {value || placeholder}
    </div>
  );
}
