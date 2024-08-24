import { LogEntry } from "../common";

export function fileTagEnricher(entry: LogEntry) {
  if (entry.config.tag === undefined) {
    entry.config.tag = entry.source_metadata.file_path;
  }

  return entry;
}
