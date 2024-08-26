---
id: rlog.logentry
title: LogEntry interface
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogEntry](./rlog.logentry.md)

## LogEntry interface

A single logging event.

**Signature:**

```typescript
export interface LogEntry 
```

## Remarks

Each message has its own instance of this, with relevant data attached.

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[config](./rlog.logentry.config.md)


</td><td>


</td><td>

Writable&lt;[RLogConfig](./rlog.rlogconfig.md)<!-- -->&gt;


</td><td>

A `Writable` version of the config that was used when sending the log entry.


</td></tr>
<tr><td>

[context?](./rlog.logentry.context.md)


</td><td>


</td><td>

[LogContext](./rlog.logcontext.md)


</td><td>

_(Optional)_ The context used when sending the log, if there was one present at all.


</td></tr>
<tr><td>

[data](./rlog.logentry.data.md)


</td><td>


</td><td>

[LogData](./rlog.logdata.md)


</td><td>

Additional data associated with the log entry.


</td></tr>
<tr><td>

[encoded_data](./rlog.logentry.encoded_data.md)


</td><td>


</td><td>

[LogData](./rlog.logdata.md)


</td><td>

Additional data associated with the log entry, encoded to be presentable in the roblox console.


</td></tr>
<tr><td>

[level](./rlog.logentry.level.md)


</td><td>


</td><td>

[LogLevel](./rlog.loglevel.md)


</td><td>

The log level of the entry.


</td></tr>
<tr><td>

[message](./rlog.logentry.message.md)


</td><td>


</td><td>

string


</td><td>

The message associated with the log entry.


</td></tr>
<tr><td>

[source_metadata](./rlog.logentry.source_metadata.md)


</td><td>


</td><td>

[SourceMetadata](./rlog.sourcemetadata.md)


</td><td>

Metadata detailing where in the source this log occurred.


</td></tr>
<tr><td>

[timestamp](./rlog.logentry.timestamp.md)


</td><td>


</td><td>

number


</td><td>

The epoch milliseconds in which the log occurred.


</td></tr>
</tbody></table>