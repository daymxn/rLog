---
id: rlog.rlog.withconfig
title: RLog.withConfig() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [withConfig](./rlog.rlog.withconfig.md)

## RLog.withConfig() method

Returns a new [RLog](./rlog.rlog.md) with the provided config merged with the existing config.

**Signature:**

```typescript
withConfig(config: PartialRLogConfig): RLog;
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

Configuration settings to apply to the new instance.


</td></tr>
</tbody></table>
**Returns:**

[RLog](./rlog.rlog.md)

The new [RLog](./rlog.rlog.md) instance

## Example


```ts
let logger = new RLog({ minLogLevel: LogLevel.DEBUG });

const data = { position: new Vector2(5, 10) };

logger.v("Hello verbose!", data);
logger.d("Hello debug!", data);
// > [DEBUG]: Hello debug!
// > { data: { position: { X: 5, Y: 10 } } }

// Inherits the minLogLevel
logger = logger.withConfig({ serialization: { encodeRobloxTypes: false } });

logger.v("Hello verbose!", data);
logger.d("Hello debug!", data);
// > [DEBUG]: Hello debug!
// > { data: { position: "<Vector2>" } }
```
