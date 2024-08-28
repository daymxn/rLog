/**
 * @license
 * Copyright 2024 Daymon Littrell-Reyes
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
