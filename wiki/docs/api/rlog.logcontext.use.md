---
id: rlog.logcontext.use
title: LogContext.use() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt; [use](./rlog.logcontext.use.md)

## LogContext.use() method

Creates a new [RLog](./rlog.rlog.md) instance that inherits this context.

**Signature:**

```typescript
use(config?: PartialRLogConfig): RLog;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

config


</td><td>

[PartialRLogConfig](./rlog.partialrlogconfig.md)


</td><td>

_(Optional)_ Config to merge with this context and the new instance.


</td></tr>
</tbody></table>
**Returns:**

[RLog](./rlog.rlog.md)

A new [RLog](./rlog.rlog.md) instance.

## Exceptions

If the context is dead (ie; if [stop](./rlog.logcontext.stop.md) was called already)

## Remarks

All [RLog](./rlog.rlog.md) instances that use the same [LogContext](./rlog.logcontext.md) will have the same `correlation_id` attached to their messages.

## Example


```ts
const context = LogContext.start();

const logger = context.use({ tag: "Main" });

logger.i("Hello world!");

context.stop();
// > [INFO]: Main -> Hello world!
// > { correlation_id: "sITjsHD89b" }
```
