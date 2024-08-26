[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [withLogContext](./rlog.withlogcontext_1.md)

## withLogContext() function

Wraps around a callback, automatically creating and managing the lifecycle for a
[LogContext](./rlog.logcontext.md)<!-- -->.

The callback will be invoked immediately, and within the same thread.

Any errors thrown within the callback will be re-thrown after calling [stop](./rlog.logcontext.stop.md) on the created
context to avoid memory leaks.

Any value returned from the callback will also be propagated appropriately.

**Signature:**

```typescript
export declare function withLogContext<R = void>(callback: ContextCallback<R>): R;
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
  withLogContext((context) => {
    buyPet(context, player.UserId, pet);
  });
});
```
