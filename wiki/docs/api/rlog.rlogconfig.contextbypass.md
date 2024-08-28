---
id: rlog.rlogconfig.contextbypass
title: RLogConfig.contextBypass property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md) &gt; [contextBypass](./rlog.rlogconfig.contextbypass.md)

## RLogConfig.contextBypass property

Allows logs that have context to bypass [minLogLevel](./rlog.rlogconfig.minloglevel.md) under certain circumstances.

**Signature:**

```typescript
readonly contextBypass: boolean;
```

## Remarks

With this setting enabled, even if the [minLogLevel](./rlog.rlogconfig.minloglevel.md) is set to filter out logs below [WARNING](./rlog.loglevel.md)<!-- -->, if one of the logs in the context is that of [WARNING](./rlog.loglevel.md) or above, then _all_ of the logs in the context will be sent through.

Allows you to set a high [minLogLevel](./rlog.rlogconfig.minloglevel.md) without sacrificing a proper log trace whenever something bad happens.

## Example


```ts
const config = { minLogLevel: LogLevel.DEBUG, contextBypass: true }

withLogContext(config, (context) => {
  const logger = context.use();

  logger.i("Hello world!");
  logger.w("Oh no!");
  logger.i("Goodbye world!");
});
// > [WARNING]: Oh no!
// > { correlation_id: "QQLRSFsPfoTfgD7b" }
//
// > [INFO]: Hello world!
// > { correlation_id: "QQLRSFsPfoTfgD7b" }
//
// > [INFO]: Goodbye world!
// > { correlation_id: "QQLRSFsPfoTfgD7b" }
```
