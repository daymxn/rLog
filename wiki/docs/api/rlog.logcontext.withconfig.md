[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md) &gt;
[withConfig](./rlog.logcontext.withconfig.md)

## LogContext.withConfig() method

Creates a new [LogContext](./rlog.logcontext.md) instance that inherits this context.

The correlation id will be the same, but the config will be merged with the provided config.

Can be used to create slightly different versions of the same context.

**Signature:**

```typescript
withConfig(config: PartialRLogConfig): LogContext;
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

Config to merge with this context.

</td></tr>
</tbody></table>
**Returns:**

[LogContext](./rlog.logcontext.md)

A new [LogContext](./rlog.logcontext.md) instance.

## Exceptions

If the context is dead (ie; if [stop](./rlog.logcontext.stop.md) was called already)

## Example

```ts
const mainContext = LogContext.start({ minLogLevel: LogLevel.DEBUG });

// inherits the `minLogLevel`
const secondaryContext = mainContext.withConfig({ contextBypass: true });
```
