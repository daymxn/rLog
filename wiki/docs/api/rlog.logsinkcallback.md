[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [LogSinkCallback](./rlog.logsinkcallback.md)

## LogSinkCallback type

Type representing a callback function for consuming log entries, or a "sink".

Sinks optionally consume [LogEntry](./rlog.logentry.md)<!-- -->s. If you return `true`<!-- -->, then the log will be
stopped, and no further sinks will be called. The [LogEntry](./rlog.logentry.md) will also not be logged to the console.

Sinks are generally used to send logs to an external database or service, but they can also be used to filter logs by
"consuming" them.

\*\*Note:\*\* you should not yield in sinks. If you're sending data to an external service, do so via queue that gets
dispatched in a different thread.

**Signature:**

```typescript
export type LogSinkCallback = (entry: LogEntry) => boolean | void;
```

**References:** [LogEntry](./rlog.logentry.md)

## Example

```ts
const logger = new rLog({
  sinks: [
    (entry) => {
      someExternalDBFunction(entry);
    },
    (entry) => {
      return true;
    },
    (entry) => {
      // never reaches because the previous sink returned true
      error("Messages should not log to the console");
    },
  ],
});

logger.i("Hello world!");
```
