# Forms - Form Builder & Component Registry

Website: [forms.bridger.to](https://forms.bridger.to)

A powerful form builder built with Next.js, React, and shadcn/ui. This project features a drag-and-drop form builder component and a shareable component registry for seamless reuse.

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

#### Locally

```bash
# Install inline-edit
npx shadcn@latest add http://localhost:3000/r/inline-edit.json

# Install form-builder
npx shadcn@latest add http://localhost:3000/r/form-builder.json
```

#### From the Website

Once deployed, components can be installed from:

```bash
npx shadcn@latest add https://forms.bridger.to/r/inline-edit.json
npx shadcn@latest add https://forms.bridger.to/r/form-builder.json
```

---

### Registry Structure

```
registry/
└── new-york/
    ├── inline-edit/
    │   └── inline-edit.tsx
    └── form-builder/
        ├── lib/
        │   ├── form-config.ts
        │   └── form-utils.ts
        └── components/
            ├── field-actions.tsx
            ├── field-editor.tsx
            ├── field-header.tsx
            ├── field-preview.tsx
            ├── form-builder.tsx
            ├── form-renderer.tsx
            ├── option-list.tsx
            └── sortable-field.tsx
```

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
