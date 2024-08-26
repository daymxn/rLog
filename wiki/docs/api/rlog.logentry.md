[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [LogEntry](./rlog.logentry.md)

## LogEntry type

A single logging event.

Each message has its own instance of this, with relevant data attached.

**Signature:**

```typescript
export type LogEntry = {
  level: LogLevel;
  message: string;
  data: LogData;
  encoded_data: LogData;
  config: Writable<RLogConfig>;
  context?: LogContext;
  timestamp: number;
  source_metadata: SourceMetadata;
};
```

**References:** [LogLevel](./rlog.loglevel.md)<!-- -->, [LogData](./rlog.logdata.md)<!-- -->,
[RLogConfig](./rlog.rlogconfig.md)<!-- -->, [LogContext](./rlog.logcontext.md)<!-- -->,
[SourceMetadata](./rlog.sourcemetadata.md)
