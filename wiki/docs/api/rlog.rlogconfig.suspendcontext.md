---
id: rlog.rlogconfig.suspendcontext
title: RLogConfig.suspendContext property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md) &gt; [suspendContext](./rlog.rlogconfig.suspendcontext.md)

## RLogConfig.suspendContext property

Prevents logs from propogating until the context is killed.

**Signature:**

```typescript
readonly suspendContext: boolean;
```

## Remarks

With this setting enabled, logs with context will not be sent until the context is stopped.

All of the messages will be sent at once when the context is stopped.

Can be used in tangent with [contextBypass](./rlog.rlogconfig.contextbypass.md) to retain log order.

## Example


```ts
const config = { minLogLevel: LogLevel.DEBUG, suspendContext: true }

withLogContext(config, (context) => {
  const logger = context.use();

  logger.i("Hello world!");
  logger.w("Oh no!");
  logger.i("Goodbye world!");
});
// > [INFO]: Hello world!
// > { correlation_id: "QQLRSFsPfoTfgD7b" }
//
// > [WARNING]: Oh no!
// > { correlation_id: "QQLRSFsPfoTfgD7b" }
//
// > [INFO]: Goodbye world!
// > { correlation_id: "QQLRSFsPfoTfgD7b" }
```
