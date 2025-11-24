# Forms - Form Builder & Component Registry

Website: [forms.bridger.to](https://forms.bridger.to)

A powerful form builder built with Next.js, React, and shadcn/ui. This project features a drag-and-drop form builder component and a shareable component registry for seamless reuse.

## Quick Install

```bash
npx shadcn@latest add https://forms.bridger.to/r/inline-edit.json https://forms.bridger.to/r/form-builder.json
```

---

## Features

- 🎨 **Visual Form Builder** – Intuitive drag-and-drop UI for designing forms
- 📝 **Flexible Field Types** – Text, email, phone, number, textarea, select, radio, checkbox, switch, slider, and more
- ✅ **Form Validation** – Built-in validation powered by Zod schemas
- 🎯 **Component Registry** – Easily install components via the shadcn CLI
- ⚡ **shadcn/ui Compatible** – Built on top of shadcn/ui for great design and flexibility

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended), or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/brijr/forms.git
cd forms

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the form builder.

---

## Component Registry

This project provides a shadcn-compatible component registry for easy integration into other projects.

### Available Components

#### Inline Edit
A click-to-edit component supporting both single-line and multiline inline editing.

**Registry Dependencies:** `input`, `textarea`

#### Form Builder
A fully-featured form builder with drag-and-drop, field validation, and form rendering.

**Registry Dependencies:** `inline-edit`, `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `field`, `dialog`, `tooltip`, `label`

**NPM Dependencies:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@tanstack/react-form`, `@tanstack/zod-form-adapter`, `zod`, `sonner`, `lucide-react`

---

### Building the Registry

To generate the registry files:

```bash
pnpm run registry:build
```

This command creates JSON bundles in `public/r/` for use by the shadcn CLI.

---

### Installing Components

Install both components with one command:

```bash
npx shadcn@latest add https://forms.bridger.to/r/inline-edit.json https://forms.bridger.to/r/form-builder.json
```

Or install them separately:

```bash
npx shadcn@latest add https://forms.bridger.to/r/inline-edit.json
npx shadcn@latest add https://forms.bridger.to/r/form-builder.json
```

#### Local Development

```bash
npx shadcn@latest add http://localhost:3000/r/inline-edit.json http://localhost:3000/r/form-builder.json
```

**Note:** Components will be installed to `components/forms/` directory. The `inline-edit` component will be installed to `components/ui/inline-edit/`.

---

### Using the Form Builder

After installation, you can use the FormBuilder component:

```tsx
import { FormBuilder } from "@/components/forms";

export default function Page() {
  return <FormBuilder />;
}
```

### Using JSON Utilities

The form builder includes JSON import/export utilities that can be used independently:

```tsx
import {
  downloadFormConfig,
  parseFormConfig,
  type FormConfig
} from "@/components/forms";

// Export a form configuration to JSON
const formConfig: FormConfig = {
  id: "form_123",
  title: "My Form",
  fields: [...]
};

downloadFormConfig(formConfig); // Downloads as JSON file

// Parse and validate an imported form configuration
const jsonString = `{"id": "form_123", "title": "My Form", "fields": []}`;
const config = parseFormConfig(jsonString);
if (config) {
  // Use the validated config
  console.log(config);
}
```

### Available Exports

From `@/components/forms`:

**Components:**
- `FormBuilder` - The main form builder component
- `FormRenderer` - Component to render forms from configuration

**Types:**
- `FormConfig` - Complete form configuration
- `FieldConfig` - Individual field configuration
- `FieldType` - Available field types
- `FieldOption` - Options for select/radio/checkbox fields
- `ValidationRule` - Validation rules for fields

**Utilities:**
- `downloadFormConfig(formConfig)` - Export form config as JSON file
- `parseFormConfig(jsonString)` - Parse and validate JSON form config
- `createDefaultField(type, index)` - Create a field with defaults
- `createEmptyForm()` - Create an empty form configuration
- `generateFormSchema(config)` - Generate Zod schema for form validation
- `getDefaultValues(config)` - Extract default values from config

---

### Registry Structure

```
registry/
└── new-york/
    ├── inline-edit/
    │   └── inline-edit.tsx
    └── forms/
        ├── lib/
        │   ├── form-config.ts
        │   └── form-utils.ts
        ├── components/
        │   ├── field-actions.tsx
        │   ├── field-editor.tsx
        │   ├── field-header.tsx
        │   ├── field-preview.tsx
        │   ├── option-list.tsx
        │   └── sortable-field.tsx
        ├── form-builder.tsx
        ├── form-renderer.tsx
        └── index.ts
```

**Installation Structure:**
When installed, components will be placed in:
- `components/forms/` - Form builder components and utilities
- `components/ui/inline-edit/` - Inline edit component

---

## Project Structure

```
├── app/                    # Next.js app directory
├── components/
│   ├── form-builder/      # Form builder components (source)
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and form config
├── registry/              # Component registry (source)
│   └── new-york/
├── public/
│   └── r/                 # Generated registry JSON files
└── registry.json         # Registry entry point
```

---

## Development

### Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm start` – Run production server
- `pnpm lint` – Run ESLint
- `pnpm registry:build` – Build registry JSON files

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn Registry Guide](https://ui.shadcn.com/docs/registry)

---

## License

MIT
