import type { SourceMetadata } from "../common";
import { LogEntry } from "../common";

/**
 * Enricher for adding a tag to a log matching the function name, if absent.
 *
 * If the entry doesn't have a tag, then this enricher will use the
 * {@link SourceMetadata.nearest_function_name | nearest_function_name} of where log occurred instead.
 *
 * @example
 * ```ts
 * const logger = new RLog({ enrichers: [functionTagEnricher] });
 *
 * function CoolFunction() {
 *  logger.i("Hello world!");
 * }
 *
 * CoolFunction();
 * // > [INFO]: CoolFunction -> Hello world!
 * ```
 */
export function functionTagEnricher(entry: LogEntry) {
  if (entry.config.tag === undefined) {
    entry.config.tag = entry.source_metadata.nearest_function_name;
  }

  return entry;
}
