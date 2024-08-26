import { LogEntry } from "../common";

/**
 * Attaches {@link LogEntry.source_metadata | source_metadata } to the output of a log entry.
 *
 * @remarks
 *
 * The metadata is attached under the `source_metadata` key in {@link LogEntry.encoded_data | encoded_data}.
 *
 * If a value is `undefined`, it will not be populated.
 *
 * @public
 *
 * @example
 * ```log
 * [INFO]: Actions -> Hello world!
 * {
 *   data: {
 *     source_metadata: {
 *       function_name: "doAction",
 *       nearest_function_name: "doAction",
 *       file_path: "ReplicatedStorage.TS.actions",
 *       line_number: 5
 *     }
 *   }
 * }
 * ```
 */
export function sourceMetadataEnricher(entry: LogEntry): LogEntry {
  entry.encoded_data["source_metadata"] = entry.source_metadata;

  return entry;
}
