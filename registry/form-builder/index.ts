// Main exports for the forms component library
export { FormBuilder } from "./form-builder";
export { FormRenderer } from "./form-renderer";

// Export hook
export { useFormBuilder } from "./use-form-builder";
export type { ViewMode } from "./use-form-builder";

// Export types
export type {
  FormConfig,
  FieldConfig,
  FieldType,
  FieldOption,
  ValidationRule,
  TextFieldConfig,
  NumberFieldConfig,
  TextareaFieldConfig,
  SelectFieldConfig,
  CheckboxGroupFieldConfig,
  RadioFieldConfig,
  CheckboxFieldConfig,
  SwitchFieldConfig,
  SliderFieldConfig,
  YesNoFieldConfig,
  FieldTypeConfig,
} from "./lib/form-config";

export {
  createDefaultField,
  createEmptyForm,
  FIELD_TYPES,
  CATEGORIES,
} from "./lib/form-config";

// Export JSON utilities
export {
  downloadFormConfig,
  parseFormConfig,
  validateFormConfig,
  generateFormSchema,
  getDefaultValues,
  generateFieldSchema,
  getFieldTypeIcon,
  hasOptions,
  supportsPlaceholder,
  supportsRequired,
} from "./lib/form-utils";
