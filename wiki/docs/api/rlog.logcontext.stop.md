---
id: rlog.logcontext.stop
title: LogContext.stop() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt; [stop](./rlog.logcontext.stop.md)

## LogContext.stop() method

Marks this context as dead, preventing any further usage.

**Signature:**

```typescript
stop(): void;
```
**Returns:**

void

## Remarks

Will make calls to the context manager to ensure there are no memory leaks.

Can safely be called multiple times, calling stop on an already dead instance will _not_ throw an error.

## Example


```ts
function GiveMoney(context: LogContext, player: Player, money: number) {
  // ...
}

remotes.giveMoney.connect((player: Player, money: number) => {
  const context = LogContext.start();

  GiveMoney(context, player, money);

  context.stop();
});
```
