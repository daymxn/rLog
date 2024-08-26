---
id: rlog.withlogcontextasync
title: withLogContextAsync() function
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [withLogContextAsync](./rlog.withlogcontextasync.md)

## withLogContextAsync() function

Wraps around an async callback, automatically creating and managing the lifecycle for a [LogContext](./rlog.logcontext.md)<!-- -->.

**Signature:**

```typescript
export declare function withLogContextAsync<R = void>(config: PartialRLogConfig, callback: ContextCallback<Promise<R>>): Promise<R>;
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

Config to create the context with.


</td></tr>
<tr><td>

callback


</td><td>

[ContextCallback](./rlog.contextcallback.md)<!-- -->&lt;Promise&lt;R&gt;&gt;


</td><td>

[ContextCallback](./rlog.contextcallback.md) scope to run and provide the context for.


</td></tr>
</tbody></table>
**Returns:**

Promise&lt;R&gt;

## Remarks

Will call [stop](./rlog.logcontext.stop.md) on the created context when the executed scope is finished- regardless if the promise was cancelled or threw an error.

Any value returned from the callback will also be propagated appropriately.

## Example


```ts
remotes.buyPet.onRequest((player: Player, pet: PetId) =>
  // automatically starts and stops the context
  withLogContextAsync({ minLogLevel: LogLevel.DEBUG }, async (context) => {
    return buyPet(context, player.UserId, pet);
  }),
);
```
