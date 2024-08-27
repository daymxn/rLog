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

import type { SourceMetadata } from "../common";
import { LogEntry } from "../common";

/**
 * Enricher for adding a tag to a log matching the file path, if absent.
 *
 * @remarks
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
