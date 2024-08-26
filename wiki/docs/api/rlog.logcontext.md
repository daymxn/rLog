[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md)

## LogContext class

Context for a collection of log entries.

Provides a centrialized means for tracking correlation ids, allowing you to create a linkage between log entries in
individual logic flows- enabling more streamlined debugging in high traffic or asynchronous environments.

**Signature:**

```typescript
export declare class LogContext
```

## Constructors

<table><thead><tr><th>

Constructor

</th><th>

Modifiers

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

[(constructor)(correlation_id, config)](./rlog.logcontext._constructor_.md)

</td><td>

</td><td>

Constructor for manually creating a [LogContext](./rlog.logcontext.md)<!-- -->.

</td></tr>
</tbody></table>

## Properties

<table><thead><tr><th>

Property

</th><th>

Modifiers

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

[config](./rlog.logcontext.config.md)

</td><td>

`readonly`

</td><td>

[RLogConfig](./rlog.rlogconfig.md)

</td><td>

</td></tr>
<tr><td>

[correlation_id](./rlog.logcontext.correlation_id.md)

</td><td>

`readonly`

</td><td>

string

</td><td>

</td></tr>
</tbody></table>

## Methods

<table><thead><tr><th>

Method

</th><th>

Modifiers

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

[IsDead()](./rlog.logcontext.isdead.md)

</td><td>

</td><td>

A context is considered dead after [stop](./rlog.logcontext.stop.md) has been called.

A dead context should not be used anymore, and can not be re-started.

</td></tr>
<tr><td>

[start(config)](./rlog.logcontext.start.md)

</td><td>

`static`

</td><td>

Creates a new [LogContext](./rlog.logcontext.md)<!-- -->.

The context can be used to create [RLog](./rlog.rlog.md) instances by calling [use](./rlog.logcontext.use.md)<!-- -->.

When you're done with the context, make sure to call [stop](./rlog.logcontext.stop.md) to prevent memory leaks.

</td></tr>
<tr><td>

[stop()](./rlog.logcontext.stop.md)

</td><td>

</td><td>

Marks this context as dead, preventing any further usage.

Will make calls to the context manager to ensure there are no memory leaks.

Can safely be called multiple times, calling stop on an already dead instance will \_not\_ throw an error.

</td></tr>
<tr><td>

[use(config)](./rlog.logcontext.use.md)

</td><td>

</td><td>

Creates a new [RLog](./rlog.rlog.md) instance that inherits this context.

All [RLog](./rlog.rlog.md) instances that use the same [LogContext](./rlog.logcontext.md) will have the same
`correlation_id` attached to their messages.

</td></tr>
<tr><td>

[withConfig(config)](./rlog.logcontext.withconfig.md)

</td><td>

</td><td>

Creates a new [LogContext](./rlog.logcontext.md) instance that inherits this context.

The correlation id will be the same, but the config will be merged with the provided config.

Can be used to create slightly different versions of the same context.

</td></tr>
</tbody></table>
