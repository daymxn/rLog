[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt;
[ForceContextFlush](./rlog.rlog.forcecontextflush.md)

## RLog.ForceContextFlush() method

Force any pending messages to be sent through the sinks, regardless of the `minLogLevel`<!-- -->.

Inteded to be called before the game closes, to ensure there are no missing logs.

**Signature:**

```typescript
static ForceContextFlush(): void;
```

**Returns:**

void

## Example

```ts
game.bindToClose(() => {
  RLog.ForceContextFlush();
});
```
