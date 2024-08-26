---
id: rlog.serializationconfig.encodemethod
title: SerializationConfig.encodeMethod property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [SerializationConfig](./rlog.serializationconfig.md) &gt; [encodeMethod](./rlog.serializationconfig.encodemethod.md)

## SerializationConfig.encodeMethod property

The method name to use for class encoding.

**Signature:**

```typescript
readonly encodeMethod: string;
```

## Remarks

When encoding an object, the encoder will first check if the object has a method with this name. If it does, it will call that method instead of trying to manually encode it.

## Example


```ts
class PlayerClass {
  constructor(public name: string) {};

  public encode() {
   return { name: this.name };
  }
}

const player = new PlayerClass("daymon");

let logger = new RLog();

logger.i("Player created", { player: player });
// > [INFO]: Player created
// > { "data": { "player": "PlayerClass" } }

logger = new RLog({ serialization: { encodeMethod: "encode" } });

logger.i("Player created", { player: player });
// > [INFO]: Player created
// > { "data": { "player": { "name": "daymon" } } }
```
