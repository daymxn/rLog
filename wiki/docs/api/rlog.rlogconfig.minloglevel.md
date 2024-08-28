---
id: rlog.rlogconfig.minloglevel
title: RLogConfig.minLogLevel property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md) &gt; [minLogLevel](./rlog.rlogconfig.minloglevel.md)

## RLogConfig.minLogLevel property

Sets the minimum [LogLevel](./rlog.loglevel.md) for data to be logged.

Messages below the minimum level will be ignored.

**Signature:**

```typescript
readonly minLogLevel: LogLevel;
```

## Example


```ts
let logger = new RLog();

logger.v("Hello verbose!");
logger.d("Hello debug!");
// > [VERBOSE]: Hello verbose!
// > [DEBUG]: Hello debug!

logger = logger.withMinLogLevel(LogLevel.DEBUG);

logger.v("Hello verbose!");
logger.d("Hello debug!");
// > [DEBUG]: Hello debug!
```
