---
id: rlog.rlog.clone
title: RLog.clone() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [clone](./rlog.rlog.clone.md)

## RLog.clone() method

Creates a new [RLog](./rlog.rlog.md) instance with all the same settings and properties.

**Signature:**

```typescript
clone(): RLog;
```
**Returns:**

[RLog](./rlog.rlog.md)

A duplicate of this [RLog](./rlog.rlog.md) instance.

## Remarks

Everything is deep copied, so any mutations to the original will safely not replicate.
