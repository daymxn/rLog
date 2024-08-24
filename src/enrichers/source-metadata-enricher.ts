import { LogEntry } from "../common";
import { RLog } from "../rlog";

/**
 * Attaches source metadata to a log entry.
 *
 * The metadata is attached under the `source_metadata` key in data.
 *
 * You also need to have {@link RLog.forceSourceMetadata | source metadata} enabled
 * for metadata to be properly found.
 *
 * If a value is `undefined`, it will not be populated.
 *
 * @public
 *
 * @example
 * ### Setup
 * #### In file `main.ts`
 * ```ts
 * import { rLog, attachSourceMetadata } from "@rbxts/rlog";
 * rLog.setDefaultConfig({ forceSourceMetadata: true }).withEnricher(attachSourceMetadata);
 *
 * import { doAction } from "./actions";
 *
 * doAction();
 * ```
 *
 * #### In file `actions.ts`
 * ```ts
 * import { rLog } from "@rbxts/rlog";
 *
 * const Logger = new rLog().withTag("Actions");
 *
 * export function doAction() {
 *   const log = Logger.child();
 *
 *   log.i("Hello world!");
 * }
 * ```
 *
 * ### Output
 * ```text
 * [INFO]: Actions -> Hello world!
 * {
 *   data: {
 *     source_metadata: {
 *       file_name: "actions",
 *       full_file_path: "ReplicatedStorage.TS.actions",
 *       function_name: "doAction"
 *     }
 *   }
 * }
 * ```
 */
// TODO(): update docs
export function sourceMetadataEnricher(entry: LogEntry): LogEntry {
  entry.encoded_data["source_metadata"] = entry.source_metadata;

  return entry;
}
