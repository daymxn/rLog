---
id: rlog.rlog.clone_1
title: RLog.clone() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [clone](./rlog.rlog.clone_1.md)

## RLog.clone() method

Creates a new [RLog](./rlog.rlog.md) instance with all the same settings and properties.

The provided [parameters](./rlog.rlogconstructorparameters.md) will be merged with the existing parameters on this instance.

**Signature:**

```typescript
clone(params: RLogConstructorParameters): RLog;
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

params


</td><td>

[RLogConstructorParameters](./rlog.rlogconstructorparameters.md)


</td><td>


</td></tr>
</tbody></table>
**Returns:**

[RLog](./rlog.rlog.md)

A duplicate of this [RLog](./rlog.rlog.md) instance.

## Remarks

Everything is deep copied, so any mutations to the original will safely not replicate.
