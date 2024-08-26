---
id: rlog.logcontext._constructor_
title: LogContext.(constructor)
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt; [(constructor)](./rlog.logcontext._constructor_.md)

## LogContext.(constructor)

Constructor for manually creating a [LogContext](./rlog.logcontext.md)<!-- -->.

**Signature:**

```typescript
constructor(correlation_id: string, config: RLogConfig);
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

correlation_id


</td><td>

string


</td><td>

Tracking identifier attached to all logs that use this context.


</td></tr>
<tr><td>

config


</td><td>

[RLogConfig](./rlog.rlogconfig.md)


</td><td>

Common configuration shared between all consumers of this context.


</td></tr>
</tbody></table>