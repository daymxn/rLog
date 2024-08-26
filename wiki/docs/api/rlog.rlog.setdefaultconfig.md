[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt;
[SetDefaultConfig](./rlog.rlog.setdefaultconfig.md)

## RLog.SetDefaultConfig() method

Overwrites the config for the [default](./rlog.rlog.default.md) instance.

You will rarely need to use this, and generally will want to be using
[UpdateDefaultConfig](./rlog.rlog.updatedefaultconfig.md) insted.

**Signature:**

```typescript
static SetDefaultConfig(config: PartialRLogConfig): void;
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

The [RLogConfig](./rlog.rlogconfig.md) to use.

</td></tr>
</tbody></table>
**Returns:**

void
