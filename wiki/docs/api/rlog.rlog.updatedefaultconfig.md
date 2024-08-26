---
id: rlog.rlog.updatedefaultconfig
title: RLog.UpdateDefaultConfig() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [UpdateDefaultConfig](./rlog.rlog.updatedefaultconfig.md)

## RLog.UpdateDefaultConfig() method

Merges the given config with the existing config for the [default](./rlog.rlog.default.md) instance.

Since all [RLog](./rlog.rlog.md) instances inherit their config from the default instance, this is a convenient way to provide default configuration settings.

**Signature:**

```typescript
static UpdateDefaultConfig(config: PartialRLogConfig): void;
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

The [RLogConfig](./rlog.rlogconfig.md) to use.


</td></tr>
</tbody></table>
**Returns:**

void

## Example


```ts
RLog.UpdateDefaultConfig({ serialization: { encodeFunctions: true } });

// Inherits the `encodeFunctions` setting automatically
const logger = new RLog({ serialization: { encodeRobloxTypes: false } });

logger.i("Player died", { player: player, location: player.Position, revive: () => {} });
// > [INFO]: Player died
// > { "data": { "player": 1338, "location": "<Vector3>", "revive": "<Function>" } }
```
