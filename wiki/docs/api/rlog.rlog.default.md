---
id: rlog.rlog.default
title: RLog.default property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [default](./rlog.rlog.default.md)

## RLog.default property

The default or "global" [RLog](./rlog.rlog.md) instance.

**Signature:**

```typescript
static readonly default: RLog;
```

## Remarks

All loggers inherit from this, so it's a convenient way for attaching global sinks, enrichers, or configuration.

You can also use [rLogger](./rlog.rlogger.md) for style purposes.
