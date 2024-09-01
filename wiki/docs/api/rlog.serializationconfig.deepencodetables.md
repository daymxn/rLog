---
id: rlog.serializationconfig.deepencodetables
title: SerializationConfig.deepEncodeTables property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [SerializationConfig](./rlog.serializationconfig.md) &gt; [deepEncodeTables](./rlog.serializationconfig.deepencodetables.md)

## SerializationConfig.deepEncodeTables property

Whether to perform deep encoding on tables.

**Signature:**

```typescript
readonly deepEncodeTables: boolean;
```

## Remarks

When disabled, tables will not be recursively encoded, which may cause you to miss out on certain data types being properly translated (e.g., roblox data types).

This will occur even if you have [encodeRobloxTypes](./rlog.serializationconfig.encoderobloxtypes.md) enabled.

But if you have deeply nested data types, or are wanting to save on performance, this may be desirable.

## Example


```
const event = {
  source: {
    position: new Vector2(1, 1),
    distance: 100
  },
  target: new Vector2(2, 2),
};

let logger = new RLog({ serialization: { deepEncodeTables: true } });
logger.i("Gun was fired", event);
// > [INFO]: Gun was fired
// > { "data": { "source": { "position": { "X": 1, "Y": 1}, "distance": 100 }, "target": { "X": 2, "Y": 2} } }

logger = new RLog({ serialization: { deepEncodeTables: false } });
logger.i("Gun was fired", event);
// > [INFO]: Gun was fired
// > { "data": { "source": { "position": null, "distance": 100 }, "target": { "X": 2, "Y": 2} } }
```
