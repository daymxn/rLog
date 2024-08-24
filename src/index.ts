/**
 * Metadata based logging framework for ROBLOX projects.
 *
 * @remarks
 * `rlog` exports the {@link RLog} class as the primary entry point.
 *
 * @packageDocumentation
 */
export { LogData, LogEnricherCallback, LogEntry, LogLevel, LogSinkCallback } from "./common";
export { PartialRLogConfig, RLogConfig, SerializationConfig } from "./configuration";
export { fileTagEnricher, functionTagEnricher, sourceMetadataEnricher } from "./enrichers";
export { RLog, RLogConstructorParameters, rLog, rLogger, rlog } from "./rlog";
export { robloxConsoleSink } from "./sinks";
