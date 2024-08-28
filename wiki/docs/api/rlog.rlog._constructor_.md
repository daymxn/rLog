---
id: rlog.rlog._constructor_
title: RLog.(constructor)
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [(constructor)](./rlog.rlog._constructor_.md)

## RLog.(constructor)

Constructs a new [RLog](./rlog.rlog.md) instance.

**Signature:**

```typescript
constructor(config?: PartialRLogConfig, context?: LogContext, inheritDefault?: boolean);
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

_(Optional)_ Configuration settings to use for this logger instance.


</td></tr>
<tr><td>

context


</td><td>

[LogContext](./rlog.logcontext.md)


</td><td>

_(Optional)_ The [LogContext](./rlog.logcontext.md) to use as a base for this instance.


</td></tr>
<tr><td>

inheritDefault


</td><td>

boolean


</td><td>

_(Optional)_ Whether to merge configs with the [default instance](./rlog.rlog.default.md)<!-- -->. Defaults to true.


</td></tr>
</tbody></table>