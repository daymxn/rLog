[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md)

## RobloxConsoleSinkConfig type

Configuration options for [robloxConsoleSink()](./rlog.robloxconsolesink.md)<!-- -->.

**Signature:**

```typescript
export type RobloxConsoleSinkConfig = {
  readonly formatMethod?: FormatMethodCallback;
  readonly outputMethod?: OutputMethodCallback;
  readonly minLogLevel?: LogLevel;
  readonly disable?: boolean;
};
```

**References:** [FormatMethodCallback](./rlog.formatmethodcallback.md)<!-- -->,
[OutputMethodCallback](./rlog.outputmethodcallback.md)<!-- -->, [LogLevel](./rlog.loglevel.md)
