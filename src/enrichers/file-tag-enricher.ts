import type { SourceMetadata } from "../common";
import { LogEntry } from "../common";

/**
 * Enricher for adding a tag to a log matching the file path, if absent.
 *
 * If the entry doesn't have a tag, then this enricher will use the
 * {@link SourceMetadata.file_path | file_path} of where log occurred instead.
 *
 * @example
 * ```ts
 * const logger = new RLog({ enrichers: [fileTagEnricher] });
 * logger.i("Hello world!");
 * // > [INFO]: ReplicatedStorage.TS.main -> Hello world!
 * ```
 *
 * @public
 */
export function fileTagEnricher(entry: LogEntry) {
  if (entry.config.tag === undefined) {
    entry.config.tag = entry.source_metadata.file_path;
  }

  return entry;
}
