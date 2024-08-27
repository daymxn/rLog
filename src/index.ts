/* eslint-disable headers/header-format */
/**
 * Context based Server-Side logging framework for ROBLOX projects.
 *
 * @remarks
 * Exports the {@link RLog} class as the primary entry point.
 *
 * @packageDocumentation
 */

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

export { LogData, LogEnricherCallback, LogEntry, LogLevel, LogSinkCallback, SourceMetadata } from "./common";
export { PartialRLogConfig, RLogConfig, SerializationConfig } from "./configuration";
export { ContextCallback, LogContext, withLogContext, withLogContextAsync } from "./context";
export { fileTagEnricher, functionTagEnricher, sourceMetadataEnricher } from "./enrichers";
export { RLog, RLogConstructorParameters, rLog, rLogger, rlog } from "./rlog";
export { FormatMethodCallback, OutputMethodCallback, RobloxConsoleSinkConfig, robloxConsoleSink } from "./sinks";
