---
id: rlog.contextcallback
title: ContextCallback type
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [ContextCallback](./rlog.contextcallback.md)

## ContextCallback type

A callback that take in a [LogContext](./rlog.logcontext.md) and optionally returns a value.

**Signature:**

```typescript
export type ContextCallback<R = void> = (context: LogContext) => R;
```
**References:** [LogContext](./rlog.logcontext.md)
