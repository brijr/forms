import { z } from "zod";
import type { FieldConfig, FormConfig, ValidationRule } from "./form-config";

/**
 * Generates a Zod schema for a single field based on its configuration
 */
export function generateFieldSchema(field: FieldConfig): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base schema based on field type
  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "textarea":
      schema = z.string();
      break;

    case "number":
      schema = z.number();
      break;

    case "select":
    case "radio":
      // Create union of valid option values
      const options = field.options.map((opt) => opt.value);
      if (options.length > 0) {
        schema = z.enum(options as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;

    case "checkbox-group":
      schema = z.array(z.string());
      break;

    case "checkbox":
    case "yes-no":
    case "switch":
      schema = z.boolean();
      break;

    case "slider":
      schema = z.number();
      break;

    default:
      schema = z.string();
  }

  // Apply validation rules
  if (field.validation) {
    schema = applyValidationRules(schema, field.validation);
  }

  return schema;
}

/**
 * Applies validation rules to a Zod schema
 */
function applyValidationRules(
  schema: z.ZodTypeAny,
  validation: ValidationRule
): z.ZodTypeAny {
  let result = schema;

  // String validations
  if (result instanceof z.ZodString) {
    let stringSchema: z.ZodTypeAny = result;
    if (validation.email) {
      stringSchema = (stringSchema as z.ZodString).email(
        "Enter a valid email address."
      );
    }
    if (validation.minLength !== undefined) {
      stringSchema = (stringSchema as z.ZodString).min(
        validation.minLength,
        `Must be at least ${validation.minLength} characters.`
      );
    }
    if (validation.maxLength !== undefined) {
      stringSchema = (stringSchema as z.ZodString).max(
        validation.maxLength,
        `Must be at most ${validation.maxLength} characters.`
      );
    }
    if (validation.pattern) {
      try {
        const regex = new RegExp(validation.pattern);
        stringSchema = (stringSchema as z.ZodString).regex(
          regex,
          validation.custom || "Invalid format."
        );
      } catch {
        // Invalid regex pattern, skip
        console.warn("Invalid regex pattern:", validation.pattern);
      }
    }
    if (!validation.required) {
      stringSchema = stringSchema.optional();
    }
    result = stringSchema;
  }

  // Number validations
  if (result instanceof z.ZodNumber) {
    let numberSchema: z.ZodTypeAny = result;
    if (validation.min !== undefined) {
      numberSchema = (numberSchema as z.ZodNumber).min(
        validation.min,
        `Must be at least ${validation.min}.`
      );
    }
    if (validation.max !== undefined) {
      numberSchema = (numberSchema as z.ZodNumber).max(
        validation.max,
        `Must be at most ${validation.max}.`
      );
    }
    if (!validation.required) {
      numberSchema = numberSchema.optional();
    }
    result = numberSchema;
  }

  // Array validations
  if (result instanceof z.ZodArray) {
    let arraySchema: z.ZodTypeAny = result;
    if (validation.minLength !== undefined) {
      arraySchema = (arraySchema as z.ZodArray<any>).min(
        validation.minLength,
        `Select at least ${validation.minLength} option${
          validation.minLength !== 1 ? "s" : ""
        }.`
      );
    }
    if (validation.maxLength !== undefined) {
      arraySchema = (arraySchema as z.ZodArray<any>).max(
        validation.maxLength,
        `Select at most ${validation.maxLength} option${
          validation.maxLength !== 1 ? "s" : ""
        }.`
      );
    }
    if (!validation.required) {
      arraySchema = arraySchema.optional();
    }
    result = arraySchema;
  }

  // Boolean validations
  if (result instanceof z.ZodBoolean) {
    let booleanSchema: z.ZodTypeAny = result;
    if (validation.required) {
      booleanSchema = (booleanSchema as z.ZodBoolean).refine(
        (val) => val === true,
        {
          message: validation.custom || "This field is required.",
        }
      );
    } else {
      booleanSchema = booleanSchema.optional();
    }
    result = booleanSchema;
  }

  return result;
}

/**
 * Generates a complete Zod schema for the entire form
 */
export function generateFormSchema(
  formConfig: FormConfig
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  formConfig.fields.forEach((field) => {
    shape[field.name] = generateFieldSchema(field);
  });

  return z.object(shape);
}

/**
 * Extracts default values from the form configuration
 */
export function getDefaultValues(
  formConfig: FormConfig
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  formConfig.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else {
      // Provide sensible defaults based on type
      switch (field.type) {
        case "text":
        case "email":
        case "textarea":
        case "select":
        case "radio":
          defaults[field.name] = "";
          break;
        case "number":
          defaults[field.name] = field.defaultValue !== undefined ? field.defaultValue : 0;
          break;
        case "slider":
          defaults[field.name] = 0;
          break;
        case "checkbox":
        case "yes-no":
        case "switch":
          defaults[field.name] = false;
          break;
        case "checkbox-group":
          defaults[field.name] = [];
          break;
      }
    }
  });

  return defaults;
}

/**
 * Validates a form configuration to ensure it's valid
 */
export function validateFormConfig(config: unknown): config is FormConfig {
  if (!config || typeof config !== "object") return false;

  const obj = config as Record<string, unknown>;
  if (!obj.id || !obj.title || !Array.isArray(obj.fields)) return false;

  // Validate each field
  for (const field of obj.fields) {
    if (!field || typeof field !== "object") return false;
    const fieldObj = field as Record<string, unknown>;
    if (!fieldObj.id || !fieldObj.type || !fieldObj.name || !fieldObj.label)
      return false;
  }

  return true;
}

/**
 * Downloads form configuration as JSON file
 */
export function downloadFormConfig(formConfig: FormConfig): void {
  const json = JSON.stringify(formConfig, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${formConfig.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates imported form configuration
 */
export function parseFormConfig(jsonString: string): FormConfig | null {
  try {
    const config = JSON.parse(jsonString);
    if (validateFormConfig(config)) {
      return config;
    }
    return null;
  } catch (e) {
    console.error("Failed to parse form config:", e);
    return null;
  }
}
