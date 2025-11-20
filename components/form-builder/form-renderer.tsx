"use client"

import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import type { FormConfig, FieldConfig } from "@/lib/form-config"
import { generateFormSchema, getDefaultValues } from "@/lib/form-utils"

interface FormRendererProps {
  config: FormConfig
  onSubmit?: (values: Record<string, unknown>) => void
  showSubmitButton?: boolean
}

export function FormRenderer({
  config,
  onSubmit,
  showSubmitButton = true,
}: FormRendererProps) {
  const formSchema = generateFormSchema(config)
  const defaultValues = getDefaultValues(config)

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        onSubmit(value)
      } else {
        toast.success("Form submitted successfully!", {
          description: JSON.stringify(value, null, 2),
        })
      }
    },
  })

  const renderField = (fieldConfig: FieldConfig) => {
    switch (fieldConfig.type) {
      case "text":
      case "email":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {fieldConfig.label}
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
              )
            }}
          />
        )

      case "number":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {fieldConfig.label}
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
              )
            }}
          />
        )

      case "textarea":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {fieldConfig.label}
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
              )
            }}
          />
        )

      case "select":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {fieldConfig.label}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value as string}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue placeholder={fieldConfig.placeholder || "Select an option"} />
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
              )
            }}
          />
        )

      case "checkbox-group":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            mode="array"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet>
                  <FieldLegend variant="label">{fieldConfig.label}</FieldLegend>
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  <FieldGroup data-slot="checkbox-group">
                    {fieldConfig.options.map((option) => (
                      <Field
                        key={option.value}
                        orientation="horizontal"
                        data-invalid={isInvalid}
                      >
                        <Checkbox
                          id={`${field.name}-${option.value}`}
                          name={field.name}
                          aria-invalid={isInvalid}
                          checked={(field.state.value as string[]).includes(
                            option.value
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.pushValue(option.value)
                            } else {
                              const index = (
                                field.state.value as string[]
                              ).indexOf(option.value)
                              if (index > -1) {
                                field.removeValue(index)
                              }
                            }
                          }}
                        />
                        <FieldLabel
                          htmlFor={`${field.name}-${option.value}`}
                          className="font-normal"
                        >
                          {option.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          />
        )

      case "radio":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet>
                  <FieldLegend variant="label">{fieldConfig.label}</FieldLegend>
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
                        <Field orientation="horizontal" data-invalid={isInvalid}>
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
              )
            }}
          />
        )

      case "checkbox":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
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
              )
            }}
          />
        )

      case "switch":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
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
              )
            }}
          />
        )

      case "slider":
        return (
          <form.Field
            key={fieldConfig.id}
            name={fieldConfig.name}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {fieldConfig.label}: {field.state.value}
                  </FieldLabel>
                  <Slider
                    id={field.name}
                    name={field.name}
                    value={[field.state.value as number]}
                    onValueChange={(values) => field.handleChange(values[0])}
                    min={fieldConfig.min}
                    max={fieldConfig.max}
                    step={fieldConfig.step}
                    aria-invalid={isInvalid}
                  />
                  {fieldConfig.description && (
                    <FieldDescription>
                      {fieldConfig.description}
                    </FieldDescription>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
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
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      )}
    </form>
  )
}
