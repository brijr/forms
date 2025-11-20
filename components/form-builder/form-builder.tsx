"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FieldGroup } from "@/components/ui/field"
import {
  PlusIcon,
  Trash2Icon,
  SettingsIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DownloadIcon,
  UploadIcon,
  EyeIcon,
  CodeIcon,
} from "lucide-react"
import type { FormConfig, FieldType } from "@/lib/form-config"
import { createDefaultField, createEmptyForm } from "@/lib/form-config"
import { downloadFormConfig, parseFormConfig } from "@/lib/form-utils"
import { FormRenderer } from "./form-renderer"
import { FieldEditor } from "./field-editor"

export function FormBuilder() {
  const [formConfig, setFormConfig] = useState<FormConfig>(createEmptyForm())
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"builder" | "preview" | "json">(
    "builder"
  )

  const handleAddField = (type: FieldType) => {
    const newField = createDefaultField(type, formConfig.fields.length)
    setFormConfig({
      ...formConfig,
      fields: [...formConfig.fields, newField],
    })
    setSelectedFieldId(newField.id)
  }

  const handleDeleteField = (fieldId: string) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.filter((f) => f.id !== fieldId),
    })
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }

  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    const index = formConfig.fields.findIndex((f) => f.id === fieldId)
    if (index === -1) return

    if (direction === "up" && index > 0) {
      const newFields = [...formConfig.fields]
      ;[newFields[index - 1], newFields[index]] = [
        newFields[index],
        newFields[index - 1],
      ]
      setFormConfig({ ...formConfig, fields: newFields })
    } else if (direction === "down" && index < formConfig.fields.length - 1) {
      const newFields = [...formConfig.fields]
      ;[newFields[index], newFields[index + 1]] = [
        newFields[index + 1],
        newFields[index],
      ]
      setFormConfig({ ...formConfig, fields: newFields })
    }
  }

  const handleUpdateField = (updatedField: FieldConfig) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((f) =>
        f.id === updatedField.id ? updatedField : f
      ),
    })
  }

  const handleExport = () => {
    downloadFormConfig(formConfig)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const jsonString = event.target?.result as string
          const config = parseFormConfig(jsonString)
          if (config) {
            setFormConfig(config)
            setSelectedFieldId(null)
          } else {
            alert("Invalid form configuration file")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const selectedField = formConfig.fields.find((f) => f.id === selectedFieldId)

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex-1">
            <Input
              value={formConfig.title}
              onChange={(e) =>
                setFormConfig({ ...formConfig, title: e.target.value })
              }
              className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
              placeholder="Form Title"
            />
            <Input
              value={formConfig.description || ""}
              onChange={(e) =>
                setFormConfig({ ...formConfig, description: e.target.value })
              }
              className="text-sm text-muted-foreground border-none shadow-none px-0 focus-visible:ring-0"
              placeholder="Form description (optional)"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "builder" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("builder")}
            >
              <SettingsIcon className="h-4 w-4" />
              Builder
            </Button>
            <Button
              variant={viewMode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("preview")}
            >
              <EyeIcon className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant={viewMode === "json" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("json")}
            >
              <CodeIcon className="h-4 w-4" />
              JSON
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button variant="outline" size="sm" onClick={handleImport}>
              <UploadIcon className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {viewMode === "builder" && (
          <>
            {/* Left Sidebar - Field List */}
            <div className="w-80 overflow-y-auto border-r p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Add Field</h3>
                  <FieldGroup>
                    <Select onValueChange={(value) => handleAddField(value as FieldType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="checkbox-group">
                          Checkbox Group
                        </SelectItem>
                        <SelectItem value="radio">Radio Group</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="switch">Switch</SelectItem>
                        <SelectItem value="slider">Slider</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    Fields ({formConfig.fields.length})
                  </h3>
                  {formConfig.fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No fields yet. Add a field to get started.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formConfig.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`group rounded-lg border p-3 transition-colors cursor-pointer ${
                            selectedFieldId === field.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedFieldId(field.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {field.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {field.type}
                              </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveField(field.id, "up")
                                }}
                                disabled={index === 0}
                                className="h-6 w-6"
                              >
                                <ChevronUpIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveField(field.id, "down")
                                }}
                                disabled={index === formConfig.fields.length - 1}
                                className="h-6 w-6"
                              >
                                <ChevronDownIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteField(field.id)
                                }}
                                className="h-6 w-6 text-destructive hover:text-destructive"
                              >
                                <Trash2Icon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle - Preview */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mx-auto max-w-2xl">
                {formConfig.fields.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed p-12">
                    <div className="text-center">
                      <PlusIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No fields yet
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Add a field from the left sidebar to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  <FormRenderer config={formConfig} showSubmitButton={false} />
                )}
              </div>
            </div>

            {/* Right Sidebar - Field Editor */}
            <div className="w-80 overflow-y-auto border-l p-4">
              {selectedField ? (
                <FieldEditor
                  field={selectedField}
                  onUpdate={handleUpdateField}
                  onClose={() => setSelectedFieldId(null)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a field to edit its properties
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === "preview" && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-2xl">
              <FormRenderer config={formConfig} />
            </div>
          </div>
        )}

        {viewMode === "json" && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border bg-muted/50 p-4">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(formConfig, null, 2)}
                </pre>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(formConfig, null, 2)
                    )
                  }}
                  variant="outline"
                >
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
