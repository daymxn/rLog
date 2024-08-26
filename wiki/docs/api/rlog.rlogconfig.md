[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md)

## RLogConfig type

Configuration settings for [RLog](./rlog.rlog.md)<!-- -->.

**Signature:**

```typescript
export type RLogConfig = {
  readonly minLogLevel: LogLevel;
  readonly serialization: SerializationConfig;
  readonly correlationGenerator?: () => string;
  readonly tag?: string;
  readonly sinks?: LogSinkCallback[];
  readonly enrichers?: LogEnricherCallback[];
  readonly contextBypass: boolean;
  readonly suspendContext: boolean;
};
```

**References:** [LogLevel](./rlog.loglevel.md)<!-- -->, [SerializationConfig](./rlog.serializationconfig.md)<!-- -->,
[LogSinkCallback](./rlog.logsinkcallback.md)<!-- -->, [LogEnricherCallback](./rlog.logenrichercallback.md)
