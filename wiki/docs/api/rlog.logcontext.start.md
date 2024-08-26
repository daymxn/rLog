---
id: rlog.logcontext.start
title: LogContext.start() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt; [start](./rlog.logcontext.start.md)

## LogContext.start() method

Creates a new [LogContext](./rlog.logcontext.md)<!-- -->.

**Signature:**

```typescript
static start(config?: PartialRLogConfig): LogContext;
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

_(Optional)_ Config to use for the context. [RLog](./rlog.rlog.md) instances that use this context will merge their configs with the config of the context.


</td></tr>
</tbody></table>
**Returns:**

[LogContext](./rlog.logcontext.md)

A new [LogContext](./rlog.logcontext.md) instance.

## Remarks

The context can be used to create [RLog](./rlog.rlog.md) instances by calling [use](./rlog.logcontext.use.md)<!-- -->.

When you're done with the context, make sure to call [stop](./rlog.logcontext.stop.md) to prevent memory leaks.

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
