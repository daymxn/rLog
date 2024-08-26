---
id: rlog.serializationconfig.encodefunctions
title: SerializationConfig.encodeFunctions property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [SerializationConfig](./rlog.serializationconfig.md) &gt; [encodeFunctions](./rlog.serializationconfig.encodefunctions.md)

## SerializationConfig.encodeFunctions property

Whether to encode function types.

**Signature:**

```typescript
readonly encodeFunctions: boolean;
```

## Remarks

When this setting is disabled, all function types will be represented as `"<Function>"`<!-- -->. Otherwise, they'll be excluded from the outputted JSON.

## Example


```ts
function createPlayer(name: string) {
  return {
    name: name,
    eatFood: () => {
      // ...
    }
  }
}

const player = createPlayer("daymon");

let logger = new RLog({ serialization: { encodeFunctions: true } });

logger.i("Player created", { player: player });
// > [INFO]: Player created
// > { "data": { "player": { "name": "daymon", "eatFood": "<Function>" } } }

logger = new RLog({ serialization: { encodeFunctions: false } });

logger.i("Player created", { player: player });
// > [INFO]: Player created
// > { "data": { "player": { "name": "daymon" } } }
```
