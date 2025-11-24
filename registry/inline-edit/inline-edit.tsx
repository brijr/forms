"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

const INPUT_BASE_CLASSES =
  "border-none shadow-none px-1 -mx-1 focus-visible:ring-0 bg-transparent py-0 min-h-[1.5em] w-full leading-[inherit] text-base md:text-base";

const DISPLAY_BASE_CLASSES =
  "cursor-text hover:bg-muted/50 rounded px-1 -mx-1 transition-colors min-h-[1.5em] leading-[inherit] text-base";

export function InlineEdit({
  value,
  onSave,
  placeholder = "Click to edit",
  className,
  multiline = false,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    const element = multiline ? textareaRef.current : inputRef.current;
    if (isEditing && element) {
      element.focus();
      element.select();
    }
  }, [isEditing, multiline]);

  const handleSave = useCallback(() => {
    onSave(tempValue);
    setIsEditing(false);
  }, [tempValue, onSave]);

  const handleCancel = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !multiline) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [multiline, handleSave, handleCancel]
  );

  const handleStartEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTempValue(e.target.value);
    },
    []
  );

  if (isEditing) {
    const commonProps = {
      value: tempValue,
      onChange: handleChange,
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      placeholder,
      className: cn(INPUT_BASE_CLASSES, multiline && "resize-none", className),
    };

    return multiline ? (
      <Textarea ref={textareaRef} {...commonProps} rows={2} />
    ) : (
      <Input
        ref={inputRef}
        {...commonProps}
        className={cn(commonProps.className, "h-auto")}
      />
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      className={cn(
        DISPLAY_BASE_CLASSES,
        !value && "text-muted-foreground",
        className
      )}
    >
      {value || placeholder}
    </div>
  );
}
