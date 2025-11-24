"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import type { FormConfig, FieldConfig } from "@/registry/new-york/form-builder/lib/form-config";
import { generateFormSchema, getDefaultValues } from "@/registry/new-york/form-builder/lib/form-utils";
import { InlineEdit } from "@/registry/new-york/inline-edit/inline-edit";

interface FormRendererProps {
  config: FormConfig;
  onSubmit?: (values: Record<string, unknown>) => void;
  showSubmitButton?: boolean;
  onFieldUpdate?: (field: FieldConfig) => void;
}

export function FormRenderer({
  config,
  onSubmit,
  showSubmitButton = true,
  onFieldUpdate,
}: FormRendererProps) {
  const formSchema = generateFormSchema(config);
  const defaultValues = getDefaultValues(config);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        onSubmit(value);
      } else {
        toast.success("Form submitted successfully!", {
          description: JSON.stringify(value, null, 2),
        });
      }
    },
  });

  const formatPhoneNumber = (value: string): string => {
    if (!value) return "";

    // Check if it's an international number (starts with +)
    const hasPlus = value.startsWith("+");

    // Extract digits and preserve the + if present
    const digits = value.replace(/\D/g, "");
    const plus = hasPlus ? "+" : "";

    // If international (has + or more than 10 digits), format more flexibly
    if (hasPlus || digits.length > 10) {
      if (digits.length === 0) return plus;
      // Group digits in chunks for international format
      if (digits.length <= 3) return `${plus}${digits}`;
      if (digits.length <= 6)
        return `${plus}${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 9)
        return `${plus}${digits.slice(0, 3)} ${digits.slice(
          3,
          6
        )} ${digits.slice(6)}`;
      // For longer numbers, add spaces every 3-4 digits
      let formatted = `${plus}${digits.slice(0, 3)} ${digits.slice(
        3,
        6
      )} ${digits.slice(6, 9)}`;
      if (digits.length > 9) {
        formatted += ` ${digits.slice(9)}`;
      }
      return formatted;
    }

    // US format: (XXX) XXX-XXXX
    if (digits.length === 0) return "";
    // Handle US numbers that might start with 1
    const usDigits =
      digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
    if (usDigits.length <= 3) return `(${usDigits}`;
    if (usDigits.length <= 6)
      return `(${usDigits.slice(0, 3)}) ${usDigits.slice(3)}`;
    return `(${usDigits.slice(0, 3)}) ${usDigits.slice(3, 6)}-${usDigits.slice(
      6,
      10
    )}`;
  };

  const renderField = (fieldConfig: FieldConfig) => {
    switch (fieldConfig.type) {
      case "text":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={onFieldUpdate ? undefined : field.name}
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={fieldConfig.type}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={fieldConfig.placeholder}
                    autoComplete="off"
                  />
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "email":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={onFieldUpdate ? undefined : field.name}
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      // Remove spaces from email input
                      const valueWithoutSpaces = e.target.value.replace(
                        /\s/g,
                        ""
                      );
                      field.handleChange(valueWithoutSpaces);
                    }}
                    aria-invalid={isInvalid}
                    placeholder={fieldConfig.placeholder}
                    autoComplete="email"
                  />
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "phone":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={onFieldUpdate ? undefined : field.name}
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={formatPhoneNumber(field.state.value as string)}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const input = e.target.value;
                      // Preserve + for international numbers
                      const hasPlus = input.startsWith("+");
                      const formatted = formatPhoneNumber(input);
                      // Store digits with + prefix if it was international
                      const digits = formatted.replace(/\D/g, "");
                      const storedValue =
                        hasPlus && digits.length > 0 ? `+${digits}` : digits;
                      field.handleChange(storedValue);
                    }}
                    aria-invalid={isInvalid}
                    placeholder={fieldConfig.placeholder}
                    autoComplete="tel"
                  />
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "number":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={onFieldUpdate ? undefined : field.name}
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value as number}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    aria-invalid={isInvalid}
                    placeholder={fieldConfig.placeholder}
                  />
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "textarea":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={onFieldUpdate ? undefined : field.name}
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={fieldConfig.placeholder}
                    rows={fieldConfig.rows}
                  />
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "select":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={onFieldUpdate ? undefined : field.name}
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value as string}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue
                        placeholder={
                          fieldConfig.placeholder || "Select an option"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldConfig.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "checkbox-group":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            mode="array"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet>
                  <FieldLegend
                    variant="label"
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLegend>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  <FieldGroup data-slot="checkbox-group">
                    {fieldConfig.options.map((option) => (
                      <FieldLabel
                        key={option.value}
                        htmlFor={`${field.name}-${option.value}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={isInvalid}
                        >
                          <FieldContent>
                            <span className="text-sm">{option.label}</span>
                          </FieldContent>
                          <Checkbox
                            id={`${field.name}-${option.value}`}
                            name={field.name}
                            aria-invalid={isInvalid}
                            checked={(field.state.value as string[]).includes(
                              option.value
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.pushValue(option.value as never);
                              } else {
                                const index = (
                                  field.state.value as string[]
                                ).indexOf(option.value);
                                if (index > -1) {
                                  field.removeValue(index);
                                }
                              }
                            }}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </FieldGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          />
        );

      case "radio":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet>
                  <FieldLegend
                    variant="label"
                    onClick={(e) => {
                      if (onFieldUpdate) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {onFieldUpdate ? (
                      <InlineEdit
                        value={fieldConfig.label}
                        onSave={(val) =>
                          onFieldUpdate({ ...fieldConfig, label: val })
                        }
                        className="font-medium"
                        placeholder="Field Label"
                      />
                    ) : (
                      fieldConfig.label
                    )}
                  </FieldLegend>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  <RadioGroup
                    name={field.name}
                    value={field.state.value as string}
                    onValueChange={field.handleChange}
                  >
                    {fieldConfig.options.map((option) => (
                      <FieldLabel
                        key={option.value}
                        htmlFor={`${field.name}-${option.value}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={isInvalid}
                        >
                          <FieldContent>
                            <span className="text-sm">{option.label}</span>
                          </FieldContent>
                          <RadioGroupItem
                            value={option.value}
                            id={`${field.name}-${option.value}`}
                            aria-invalid={isInvalid}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          />
        );

      case "yes-no":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const value = field.state.value as boolean | undefined;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>{fieldConfig.label}</FieldLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={value === true ? "default" : "outline"}
                      onClick={() => field.handleChange(true)}
                      className={cn(
                        "flex-1 py-6",
                        value === true && "border border-transparent"
                      )}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={value === false ? "default" : "outline"}
                      onClick={() => field.handleChange(false)}
                      className={cn(
                        "flex-1 py-6",
                        value === false && "border border-transparent"
                      )}
                    >
                      No
                    </Button>
                  </div>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "checkbox":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value as boolean}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {fieldConfig.label}
                    </FieldLabel>
                    {fieldConfig.description && (
                      <FieldDescription>
                        {fieldConfig.description}
                      </FieldDescription>
                    )}
                  </FieldContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      case "switch":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {fieldConfig.label}
                    </FieldLabel>
                    {fieldConfig.description && (
                      <FieldDescription>
                        {fieldConfig.description}
                      </FieldDescription>
                    )}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value as boolean}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                  />
                </Field>
              );
            }}
          />
        );

      case "slider":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const currentValue = field.state.value as number;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between mb-2">
                    <FieldLabel
                      htmlFor={onFieldUpdate ? undefined : field.name}
                      onClick={(e) => {
                        if (onFieldUpdate) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      {onFieldUpdate ? (
                        <InlineEdit
                          value={fieldConfig.label}
                          onSave={(val) =>
                            onFieldUpdate({ ...fieldConfig, label: val })
                          }
                          className="font-medium"
                          placeholder="Field Label"
                        />
                      ) : (
                        fieldConfig.label
                      )}
                    </FieldLabel>
                    <span className="text-sm font-medium text-muted-foreground">
                      {currentValue}
                    </span>
                  </div>
                  <Slider
                    id={field.name}
                    name={field.name}
                    value={[currentValue]}
                    onValueChange={(values) => field.handleChange(values[0])}
                    min={fieldConfig.min}
                    max={fieldConfig.max}
                    step={fieldConfig.step}
                    aria-invalid={isInvalid}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{fieldConfig.min ?? 0}</span>
                    <span>{fieldConfig.max ?? 100}</span>
                  </div>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {config.title && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{config.title}</h2>
          {config.description && (
            <p className="text-muted-foreground">{config.description}</p>
          )}
        </div>
      )}

      <FieldGroup>{config.fields.map(renderField)}</FieldGroup>

      {showSubmitButton && (
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      )}
    </form>
  );
}
