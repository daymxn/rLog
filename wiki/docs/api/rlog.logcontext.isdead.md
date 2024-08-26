[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt;
[IsDead](./rlog.logcontext.isdead.md)

## LogContext.IsDead() method

A context is considered dead after [stop](./rlog.logcontext.stop.md) has been called.

A dead context should not be used anymore, and can not be re-started.

**Signature:**

```typescript
IsDead(): boolean;
```

**Returns:**

boolean

boolean indicating whether this context is usable or not.
