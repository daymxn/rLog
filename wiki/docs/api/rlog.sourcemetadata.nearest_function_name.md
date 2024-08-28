---
id: rlog.sourcemetadata.nearest_function_name
title: SourceMetadata.nearest_function_name property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [SourceMetadata](./rlog.sourcemetadata.md) &gt; [nearest_function_name](./rlog.sourcemetadata.nearest_function_name.md)

## SourceMetadata.nearest_function_name property

The nearest function name of where this was created.

**Signature:**

```typescript
nearest_function_name?: string;
```

## Remarks

May be undefined if we can't find one (such as reaching max depth, or a stack full of anonymous functions)

Can be used in place of [function_name](./rlog.sourcemetadata.function_name.md) for getting an idea of what's going on, even in anonymous functions.

If [function_name](./rlog.sourcemetadata.function_name.md) is present, this value will be the same.
