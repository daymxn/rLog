---
id: rlog.rlog.forcecontextflush
title: RLog.ForceContextFlush() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [ForceContextFlush](./rlog.rlog.forcecontextflush.md)

## RLog.ForceContextFlush() method

Force any pending messages to be sent through the sinks, regardless of the `minLogLevel`<!-- -->.

**Signature:**

```typescript
static ForceContextFlush(): void;
```
**Returns:**

void

## Remarks

Intended to be called before the game closes, to ensure there are no missing logs.

## Example


```ts
game.bindToClose(() => {
  RLog.ForceContextFlush();
});
```
