// Main exports for the forms component library
export { FormBuilder } from "./form-builder";
export { FormRenderer } from "./form-renderer";

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
} from "./lib/form-config";

export {
  createDefaultField,
  createEmptyForm,
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
