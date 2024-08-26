---
id: rlog.rlog.withminloglevel
title: RLog.withMinLogLevel() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [withMinLogLevel](./rlog.rlog.withminloglevel.md)

## RLog.withMinLogLevel() method

Returns a new [RLog](./rlog.rlog.md) with the [minLogLevel](./rlog.rlogconfig.minloglevel.md) set to the provided level.

Messages below the minimum level will be ignored.

**Signature:**

```typescript
withMinLogLevel(minLevel: LogLevel): RLog;
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

minLevel


</td><td>

[LogLevel](./rlog.loglevel.md)


</td><td>

The [LogLevel](./rlog.loglevel.md) to allow logs for.


</td></tr>
</tbody></table>
**Returns:**

[RLog](./rlog.rlog.md)

The new [RLog](./rlog.rlog.md) instance

## Remarks

You can also set this in the [config](./rlog.rlogconfig.md)<!-- -->, this method is provided purely as a means for easier changing.

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
