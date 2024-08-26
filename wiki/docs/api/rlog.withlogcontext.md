[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [withLogContext](./rlog.withlogcontext.md)

## withLogContext() function

Wraps around a callback, automatically creating and managing the lifecycle for a
[LogContext](./rlog.logcontext.md)<!-- -->.

The callback will be invoked immediately, and within the same thread.

Any errors thrown within the callback will be re-thrown after calling [stop](./rlog.logcontext.stop.md) on the created
context to avoid memory leaks.

Any value returned from the callback will also be propagated appropriately.

**Signature:**

```typescript
export declare function withLogContext<R = void>(config: PartialRLogConfig, callback: ContextCallback<R>): R;
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

Optional config to create the context with.

</td></tr>
<tr><td>

callback

</td><td>

[ContextCallback](./rlog.contextcallback.md)<!-- -->&lt;R&gt;

</td><td>

[ContextCallback](./rlog.contextcallback.md) scope to run and provide the context for.

</td></tr>
</tbody></table>
**Returns:**

R

## Example

```ts
remotes.buyPet.connect((player: Player, pet: PetId) => {
  // automatically starts and stops the context
  withLogContext({ minLogLevel: LogLevel.DEBUG }, (context) => {
    buyPet(context, player.UserId, pet);
  });
});
```
