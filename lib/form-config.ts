// Field types supported by the form builder
export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "checkbox-group"
  | "radio"
  | "yes-no"
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
  type: "text" | "email" | "phone"
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

// Yes/No field specific config
export interface YesNoFieldConfig extends BaseFieldConfig {
  type: "yes-no"
  defaultValue?: boolean
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
  | YesNoFieldConfig
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
        label: "Text",
        placeholder: "Enter text...",
        type: "text",
        defaultValue: "",
      }
    case "email":
      return {
        ...baseConfig,
        id: baseId,
        name: "email",
        label: "Email",
        type: "email",
        defaultValue: "",
        validation: { email: true },
      }
    case "phone":
      return {
        ...baseConfig,
        id: baseId,
        name: "phone",
        label: "Phone Number",
        type: "phone",
        defaultValue: "",
        validation: {
          pattern: "^[\\+]?[0-9]{7,15}$",
          custom: "Enter a valid phone number."
        },
      }
    case "number":
      return {
        ...baseConfig,
        label: "Number",
        placeholder: "Enter a number...",
        type: "number",
        defaultValue: undefined,
      }
    case "textarea":
      return {
        ...baseConfig,
        label: "Message",
        placeholder: "Enter your message...",
        type: "textarea",
        rows: 4,
        defaultValue: "",
      }
    case "select":
      return {
        ...baseConfig,
        label: "Select",
        type: "select",
        options: [
          { label: "First option", value: "first" },
          { label: "Second option", value: "second" },
        ],
        defaultValue: "",
      }
    case "checkbox-group":
      return {
        ...baseConfig,
        label: "Select all that apply",
        type: "checkbox-group",
        options: [
          { label: "First option", value: "first" },
          { label: "Second option", value: "second" },
        ],
        defaultValue: [],
      }
    case "radio":
      return {
        ...baseConfig,
        label: "Choose one",
        type: "radio",
        options: [
          { label: "First option", value: "first" },
          { label: "Second option", value: "second" },
        ],
        defaultValue: "",
      }
    case "checkbox":
      return {
        ...baseConfig,
        label: "I agree",
        type: "checkbox",
        defaultValue: false,
      }
    case "yes-no":
      return {
        ...baseConfig,
        label: "Yes or No",
        type: "yes-no",
        defaultValue: undefined,
      }
    case "switch":
      return {
        ...baseConfig,
        label: "Enable",
        type: "switch",
        defaultValue: false,
      }
    case "slider":
      return {
        ...baseConfig,
        label: "Range",
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
