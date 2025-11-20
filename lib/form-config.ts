// Field types supported by the form builder
export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "radio"
  | "switch"
  | "slider"

// Validation rules that can be applied to fields
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  email?: boolean
  custom?: string // Custom validation message
}

// Option for select, radio, and checkbox groups
export interface FieldOption {
  label: string
  value: string
}

// Base field configuration
export interface BaseFieldConfig {
  id: string
  type: FieldType
  name: string
  label: string
  placeholder?: string
  description?: string
  defaultValue?: string | number | boolean | string[]
  validation?: ValidationRule
}

// Text field specific config
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email"
}

// Number field specific config
export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number"
  defaultValue?: number
}

// Textarea field specific config
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea"
  rows?: number
}

// Select field specific config
export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select"
  options: FieldOption[]
}

// Checkbox group specific config
export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
  type: "checkbox-group"
  options: FieldOption[]
  defaultValue?: string[]
}

// Radio field specific config
export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio"
  options: FieldOption[]
}

// Checkbox field specific config
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox"
  defaultValue?: boolean
}

// Switch field specific config
export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch"
  defaultValue?: boolean
}

// Slider field specific config
export interface SliderFieldConfig extends BaseFieldConfig {
  type: "slider"
  min?: number
  max?: number
  step?: number
  defaultValue?: number
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxGroupFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | SwitchFieldConfig
  | SliderFieldConfig

// Form configuration
export interface FormConfig {
  id: string
  title: string
  description?: string
  fields: FieldConfig[]
}

// Helper function to create a new field with defaults
export function createDefaultField(type: FieldType, index: number): FieldConfig {
  const baseId = `field_${Date.now()}_${index}`
  const baseName = `field_${index}`

  const baseConfig = {
    id: baseId,
    name: baseName,
    label: `Field ${index + 1}`,
    placeholder: "",
    description: "",
  }

  switch (type) {
    case "text":
      return {
        ...baseConfig,
        type: "text",
        defaultValue: "",
      }
    case "email":
      return {
        ...baseConfig,
        type: "email",
        defaultValue: "",
        validation: { email: true },
      }
    case "number":
      return {
        ...baseConfig,
        type: "number",
        defaultValue: 0,
      }
    case "textarea":
      return {
        ...baseConfig,
        type: "textarea",
        rows: 4,
        defaultValue: "",
      }
    case "select":
      return {
        ...baseConfig,
        type: "select",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        defaultValue: "",
      }
    case "checkbox-group":
      return {
        ...baseConfig,
        type: "checkbox-group",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        defaultValue: [],
      }
    case "radio":
      return {
        ...baseConfig,
        type: "radio",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        defaultValue: "",
      }
    case "checkbox":
      return {
        ...baseConfig,
        type: "checkbox",
        defaultValue: false,
      }
    case "switch":
      return {
        ...baseConfig,
        type: "switch",
        defaultValue: false,
      }
    case "slider":
      return {
        ...baseConfig,
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      }
    default:
      return {
        ...baseConfig,
        type: "text",
        defaultValue: "",
      }
  }
}

// Helper function to create an empty form
export function createEmptyForm(): FormConfig {
  return {
    id: `form_${Date.now()}`,
    title: "New Form",
    description: "",
    fields: [],
  }
}
