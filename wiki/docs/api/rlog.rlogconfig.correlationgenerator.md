---
id: rlog.rlogconfig.correlationgenerator
title: RLogConfig.correlationGenerator property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md) &gt; [correlationGenerator](./rlog.rlogconfig.correlationgenerator.md)

## RLogConfig.correlationGenerator property

Function to generate correlation IDs.

**Signature:**

```typescript
readonly correlationGenerator?: () => string;
```

## Remarks

By default, Correlation IDs are generated via a combination of [HttpService.GenerateGUID](https://create.roblox.com/docs/en-us/reference/engine/classes/HttpService#GenerateGUID) and the current time- to avoid conflicts.

If you specify your own function, it will be called anytime a new Correlation ID is requested.

Especially useful if you want to create Correlation IDs to match ids in your external database.

## Example


```ts
function generateCorrelationID(): string {
  return "1";
}

const config = { correlationGenerator: generateCorrelationID };

withLogContext(config, (context) => {
  const logger = context.use();
  logger.i("Player created", { player: player });
});
// > [INFO]: Player created
// > { "correlation_id": "1", "data": { "player": 1338 } }
```
