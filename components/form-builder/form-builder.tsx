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
import {
  PlusIcon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  TypeIcon,
  MailIcon,
  HashIcon,
  AlignLeftIcon,
  ChevronDownCircleIcon,
  CheckSquareIcon,
  CircleDotIcon,
  SquareCheckIcon,
  ToggleRightIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { toast } from "sonner"
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

    // Show toast notification
    const fieldTypeLabel = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')
    toast.success(`${fieldTypeLabel} field added`, {
      description: "Configure the field in the right panel"
    })
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
      <div className="border-b px-8 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
          <div className="flex-1 space-y-1">
            <Input
              value={formConfig.title}
              onChange={(e) =>
                setFormConfig({ ...formConfig, title: e.target.value })
              }
              className="text-2xl font-medium border-none shadow-none px-0 focus-visible:ring-0 h-auto"
              placeholder="Form Title"
            />
            <Input
              value={formConfig.description || ""}
              onChange={(e) =>
                setFormConfig({ ...formConfig, description: e.target.value })
              }
              className="text-sm text-muted-foreground border-none shadow-none px-0 focus-visible:ring-0 h-auto"
              placeholder="Form description (optional)"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <Button
                variant={viewMode === "builder" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("builder")}
                className="font-normal"
              >
                Builder
              </Button>
              <Button
                variant={viewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="font-normal"
              >
                Preview
              </Button>
              <Button
                variant={viewMode === "json" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("json")}
                className="font-normal"
              >
                JSON
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleImport} className="font-normal">
                Import
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport} className="font-normal">
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {viewMode === "builder" && (
          <>
            {/* Left Sidebar - Field List */}
            <div className="w-80 overflow-y-auto border-r px-6 py-8">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Add Field</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Choose a field type to add to your form
                    </p>
                  </div>
                  <Select onValueChange={(value) => handleAddField(value as FieldType)}>
                    <SelectTrigger className="h-11 font-normal w-full">
                      <div className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        <SelectValue placeholder="Select field type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Text</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Email</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="number">
                        <div className="flex items-center gap-2">
                          <HashIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Number</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="textarea">
                        <div className="flex items-center gap-2">
                          <AlignLeftIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Textarea</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="select">
                        <div className="flex items-center gap-2">
                          <ChevronDownCircleIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Select</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="checkbox-group">
                        <div className="flex items-center gap-2">
                          <CheckSquareIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Checkbox Group</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="radio">
                        <div className="flex items-center gap-2">
                          <CircleDotIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Radio Group</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="checkbox">
                        <div className="flex items-center gap-2">
                          <SquareCheckIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Checkbox</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="switch">
                        <div className="flex items-center gap-2">
                          <ToggleRightIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Switch</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="slider">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Slider</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Fields ({formConfig.fields.length})
                  </h3>
                  {formConfig.fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No fields yet. Add a field to get started.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formConfig.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`border rounded-sm p-4 cursor-pointer transition-colors ${
                            selectedFieldId === field.id
                              ? "border-foreground bg-muted/50"
                              : "border-border"
                          }`}
                          onClick={() => setSelectedFieldId(field.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="text-sm font-medium truncate">
                                {field.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {field.type}
                              </p>
                            </div>
                            <div className="flex gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveField(field.id, "up")
                                }}
                                disabled={index === 0}
                                className="h-7 w-7"
                              >
                                <ChevronUpIcon className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveField(field.id, "down")
                                }}
                                disabled={index === formConfig.fields.length - 1}
                                className="h-7 w-7"
                              >
                                <ChevronDownIcon className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteField(field.id)
                                }}
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2Icon className="h-3.5 w-3.5" />
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
            <div className="flex-1 overflow-y-auto px-12 py-16">
              <div className="mx-auto max-w-2xl">
                {formConfig.fields.length === 0 ? (
                  <div className="flex h-full min-h-[400px] items-center justify-center border border-dashed rounded-sm p-16">
                    <div className="text-center space-y-4">
                      <PlusIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <div className="space-y-2">
                        <h3 className="text-base font-medium">
                          No fields yet
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                          Add a field from the left sidebar to get started
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FormRenderer config={formConfig} showSubmitButton={false} />
                )}
              </div>
            </div>

            {/* Right Sidebar - Field Editor */}
            <div className="w-80 overflow-y-auto border-l px-6 py-8">
              {selectedField ? (
                <FieldEditor
                  field={selectedField}
                  onUpdate={handleUpdateField}
                  onClose={() => setSelectedFieldId(null)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center px-8">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Select a field to edit its properties
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === "preview" && (
          <div className="flex-1 overflow-y-auto px-12 py-16">
            <div className="mx-auto max-w-2xl">
              <FormRenderer config={formConfig} />
            </div>
          </div>
        )}

        {viewMode === "json" && (
          <div className="flex-1 overflow-y-auto px-12 py-16">
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-sm border bg-muted/30 p-6">
                <pre className="text-sm overflow-x-auto leading-relaxed">
                  {JSON.stringify(formConfig, null, 2)}
                </pre>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(formConfig, null, 2)
                  )
                }}
                variant="ghost"
                className="font-normal"
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
