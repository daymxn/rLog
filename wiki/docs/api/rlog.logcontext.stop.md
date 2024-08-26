[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt;
[stop](./rlog.logcontext.stop.md)

## LogContext.stop() method

Marks this context as dead, preventing any further usage.

Will make calls to the context manager to ensure there are no memory leaks.

Can safely be called multiple times, calling stop on an already dead instance will \_not\_ throw an error.

**Signature:**

```typescript
stop(): void;
```

**Returns:**

void

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
