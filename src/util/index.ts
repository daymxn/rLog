import { startsWith } from "@rbxts/string-utils";

/** @internal */
export function trimStart(str: string, trim: string): string {
  if (startsWith(str, trim)) return str.sub(trim.size());
  return str;
}
