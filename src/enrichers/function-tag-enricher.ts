import { LogEntry } from "../common";

export function functionTagEnricher(entry: LogEntry) {
  if (entry.config.tag === undefined) {
    entry.config.tag = entry.source_metadata.nearest_function_name;
  }

  return entry;
}
