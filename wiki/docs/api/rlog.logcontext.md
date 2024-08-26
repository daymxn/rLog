---
id: rlog.logcontext
title: LogContext class
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogContext](./rlog.logcontext.md)

## LogContext class

Context for a collection of log entries.

**Signature:**

```typescript
export declare class LogContext 
```

## Remarks

Provides a centrialized means for tracking correlation ids, allowing you to create a linkage between log entries in individual logic flows- enabling more streamlined debugging in high traffic or asynchronous environments.

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


</td></tr>
<tr><td>

[start(config)](./rlog.logcontext.start.md)


</td><td>

`static`


</td><td>

Creates a new [LogContext](./rlog.logcontext.md)<!-- -->.


</td></tr>
<tr><td>

[stop()](./rlog.logcontext.stop.md)


</td><td>


</td><td>

Marks this context as dead, preventing any further usage.


</td></tr>
<tr><td>

[use(config)](./rlog.logcontext.use.md)


</td><td>


</td><td>

Creates a new [RLog](./rlog.rlog.md) instance that inherits this context.


</td></tr>
<tr><td>

[withConfig(config)](./rlog.logcontext.withconfig.md)


</td><td>


</td><td>

Creates a new [LogContext](./rlog.logcontext.md) instance that inherits this context.


</td></tr>
</tbody></table>