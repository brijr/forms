import type { FieldType } from "./form-config";

export const TOOLBOX_PREFIX = "toolbox-";
export const CANVAS_DROP_ZONE_ID = "canvas-drop-zone";

export function isToolboxItem(id: string | number): boolean {
  return typeof id === "string" && id.startsWith(TOOLBOX_PREFIX);
}

export function getFieldTypeFromToolboxId(id: string): FieldType {
  return id.replace(TOOLBOX_PREFIX, "") as FieldType;
}

export function createToolboxId(fieldType: FieldType): string {
  return `${TOOLBOX_PREFIX}${fieldType}`;
}
