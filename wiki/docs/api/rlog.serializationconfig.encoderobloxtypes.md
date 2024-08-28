---
id: rlog.serializationconfig.encoderobloxtypes
title: SerializationConfig.encodeRobloxTypes property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [SerializationConfig](./rlog.serializationconfig.md) &gt; [encodeRobloxTypes](./rlog.serializationconfig.encoderobloxtypes.md)

## SerializationConfig.encodeRobloxTypes property

Whether to encode Roblox-specific types.

**Signature:**

```typescript
readonly encodeRobloxTypes: boolean;
```

## Remarks

When this setting is disabled, all roblox-specific types will instead just be represented as `"<TYPE_NAME>"`<!-- -->.

## Example


```ts
logger.i("Player died", { player: player, location: player.Position });
// > [INFO]: Player died
// > { "data": { "player": 1338, "location": "<Vector3>" } }
```
