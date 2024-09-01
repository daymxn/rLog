---
id: rlog
title: rlog package
hide_title: true
---


## rlog package

Context-based server-side logging framework for ROBLOX projects.

## Remarks

Exports the [RLog](./rlog.rlog.md) class as the primary entry point.

## Classes

<table><thead><tr><th>

Class


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[LogContext](./rlog.logcontext.md)


</td><td>

Context for a collection of log entries.


</td></tr>
<tr><td>

[RLog](./rlog.rlog.md)


</td><td>

Class for server-side Roblox Logging.


</td></tr>
</tbody></table>

## Enumerations

<table><thead><tr><th>

Enumeration


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[LogLevel](./rlog.loglevel.md)


</td><td>

Enum representing the various log levels, or "importance" of a [LogEntry](./rlog.logentry.md)<!-- -->.


</td></tr>
</tbody></table>

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[fileTagEnricher(entry)](./rlog.filetagenricher.md)


</td><td>

Enricher for adding a tag to a log matching the file path, if absent.


</td></tr>
<tr><td>

[functionTagEnricher(entry)](./rlog.functiontagenricher.md)


</td><td>

Enricher for adding a tag to a log matching the function name, if absent.


</td></tr>
<tr><td>

[robloxConsoleSink(params)](./rlog.robloxconsolesink.md)


</td><td>

The default sink for sending messages to the roblox console.


</td></tr>
<tr><td>

[sourceMetadataEnricher(entry)](./rlog.sourcemetadataenricher.md)


</td><td>

Attaches [source_metadata](./rlog.logentry.source_metadata.md) to the output of a log entry.


</td></tr>
<tr><td>

[withLogContext(config, callback)](./rlog.withlogcontext.md)


</td><td>

Wraps around a callback, automatically creating and managing the lifecycle for a [LogContext](./rlog.logcontext.md)<!-- -->.


</td></tr>
<tr><td>

[withLogContext(callback)](./rlog.withlogcontext_1.md)


</td><td>

Wraps around a callback, automatically creating and managing the lifecycle for a [LogContext](./rlog.logcontext.md)<!-- -->.


</td></tr>
<tr><td>

[withLogContextAsync(config, callback)](./rlog.withlogcontextasync.md)


</td><td>

Wraps around an async callback, automatically creating and managing the lifecycle for a [LogContext](./rlog.logcontext.md)<!-- -->.


</td></tr>
<tr><td>

[withLogContextAsync(callback)](./rlog.withlogcontextasync_1.md)


</td><td>

Wraps around an async callback, automatically creating and managing the lifecycle for a [LogContext](./rlog.logcontext.md)<!-- -->.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[LogEntry](./rlog.logentry.md)


</td><td>

A single logging event.


</td></tr>
<tr><td>

[RLogConfig](./rlog.rlogconfig.md)


</td><td>

Configuration settings for [RLog](./rlog.rlog.md)<!-- -->.


</td></tr>
<tr><td>

[RLogConstructorParameters](./rlog.rlogconstructorparameters.md)


</td><td>

Table version of the constructor parameters for [RLog](./rlog.rlog.md)<!-- -->.


</td></tr>
<tr><td>

[RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md)


</td><td>

Configuration options for [robloxConsoleSink()](./rlog.robloxconsolesink.md)<!-- -->.


</td></tr>
<tr><td>

[SerializationConfig](./rlog.serializationconfig.md)


</td><td>

Configuration settings for serialization.


</td></tr>
<tr><td>

[SourceMetadata](./rlog.sourcemetadata.md)


</td><td>

Metadata used in identifying _where_ in the source code a log occurred.


</td></tr>
</tbody></table>

## Variables

<table><thead><tr><th>

Variable


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[rLogger](./rlog.rlogger.md)


</td><td>

Mapping to [RLog.default](./rlog.rlog.default.md) for easier default usage.


</td></tr>
</tbody></table>

## Type Aliases

<table><thead><tr><th>

Type Alias


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[ContextCallback](./rlog.contextcallback.md)


</td><td>

A callback that take in a [LogContext](./rlog.logcontext.md) and optionally returns a value.


</td></tr>
<tr><td>

[FormatMethodCallback](./rlog.formatmethodcallback.md)


</td><td>

Type representing a callback function for converting log entries to output.


</td></tr>
<tr><td>

[LogData](./rlog.logdata.md)


</td><td>

Type representing the additional data associated with a log entry.


</td></tr>
<tr><td>

[LogEnricherCallback](./rlog.logenrichercallback.md)


</td><td>

Type representing a callback function for enriching log entries, or an "enricher".

Enrichers optionally mutate [LogEntry](./rlog.logentry.md)<!-- -->s. You can add data to a [LogEntry](./rlog.logentry.md)<!-- -->, edit its [metadata](./rlog.logentry.source_metadata.md)<!-- -->, or just return it if you don't need to do anything.


</td></tr>
<tr><td>

[LogSinkCallback](./rlog.logsinkcallback.md)


</td><td>

Type representing a callback function for consuming log entries, or a "sink".

Sinks are generally used to send logs to an external database or service, but they can also be used to filter logs by "consuming" them.

If your callback returns `true`<!-- -->, then the log will be stopped, and no further sinks will be called. The [LogEntry](./rlog.logentry.md) will also not be logged to the console.


</td></tr>
<tr><td>

[OutputMethodCallback](./rlog.outputmethodcallback.md)


</td><td>

Type representing a callback function for sending a log to the roblox console.


</td></tr>
<tr><td>

[PartialRLogConfig](./rlog.partialrlogconfig.md)


</td><td>

Version of [RLogConfig](./rlog.rlogconfig.md) that allows all data to be absent.


</td></tr>
</tbody></table>