---
id: rlog.rlog
title: RLog class
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md)

## RLog class

Class for Server-Side Roblox Logging.

**Signature:**

```typescript
export declare class RLog 
```

## Remarks

You can also use `rlog` or `rLog`<!-- -->- for style purposes.

## Constructors

<table><thead><tr><th>

Constructor


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[(constructor)(config, context, inheritDefault)](./rlog.rlog._constructor_.md)


</td><td>


</td><td>

Constructs a new [RLog](./rlog.rlog.md) instance.


</td></tr>
<tr><td>

[(constructor)(params)](./rlog.rlog._constructor__1.md)


</td><td>


</td><td>

Constructs a new [RLog](./rlog.rlog.md) instance.

Uses the provided table in place of the argument names.


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

[context](./rlog.rlog.context.md)


</td><td>

`readonly`


</td><td>

[LogContext](./rlog.logcontext.md) \| undefined


</td><td>

The [LogContext](./rlog.logcontext.md) assigned to this instance, if any.


</td></tr>
<tr><td>

[default](./rlog.rlog.default.md)


</td><td>

`static`

`readonly`


</td><td>

[RLog](./rlog.rlog.md)


</td><td>

The default or "global" [RLog](./rlog.rlog.md) instance.


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

[clone()](./rlog.rlog.clone.md)


</td><td>


</td><td>

Creates a new [RLog](./rlog.rlog.md) instance with all the same settings and properties.


</td></tr>
<tr><td>

[clone(params)](./rlog.rlog.clone_1.md)


</td><td>


</td><td>

Creates a new [RLog](./rlog.rlog.md) instance with all the same settings and properties.

The provided [parameters](./rlog.rlogconstructorparameters.md) will be merged with the existing parameters on this instance.


</td></tr>
<tr><td>

[d(message, data)](./rlog.rlog.d.md)


</td><td>


</td><td>

Shorthand version of [debug](./rlog.rlog.debug.md)<!-- -->.


</td></tr>
<tr><td>

[debug(message, data)](./rlog.rlog.debug.md)


</td><td>


</td><td>

Logs a debug message.


</td></tr>
<tr><td>

[e(message, data)](./rlog.rlog.e.md)


</td><td>


</td><td>

Shorthand version of [error](./rlog.rlog.error.md)<!-- -->.


</td></tr>
<tr><td>

[error(message, data)](./rlog.rlog.error.md)


</td><td>


</td><td>

Logs an error message.


</td></tr>
<tr><td>

[ForceContextFlush()](./rlog.rlog.forcecontextflush.md)


</td><td>

`static`


</td><td>

Force any pending messages to be sent through the sinks, regardless of the `minLogLevel`<!-- -->.


</td></tr>
<tr><td>

[i(message, data)](./rlog.rlog.i.md)


</td><td>


</td><td>

Shorthand version of [info](./rlog.rlog.info.md)<!-- -->.


</td></tr>
<tr><td>

[info(message, data)](./rlog.rlog.info.md)


</td><td>


</td><td>

Logs an informational message.


</td></tr>
<tr><td>

[log(level, message, data)](./rlog.rlog.log.md)


</td><td>


</td><td>

Logs a message with a specified log level.


</td></tr>
<tr><td>

[ResetDefaultConfig()](./rlog.rlog.resetdefaultconfig.md)


</td><td>

`static`


</td><td>

Resets the config for the [default](./rlog.rlog.default.md) instance to the original settings.


</td></tr>
<tr><td>

[SetDefaultConfig(config)](./rlog.rlog.setdefaultconfig.md)


</td><td>

`static`


</td><td>

Overwrites the config for the [default](./rlog.rlog.default.md) instance.


</td></tr>
<tr><td>

[UpdateDefaultConfig(config)](./rlog.rlog.updatedefaultconfig.md)


</td><td>

`static`


</td><td>

Merges the given config with the existing config for the [default](./rlog.rlog.default.md) instance.

Since all [RLog](./rlog.rlog.md) instances inherit their config from the default instance, this is a convenient way to provide default configuration settings.


</td></tr>
<tr><td>

[v(message, data)](./rlog.rlog.v.md)


</td><td>


</td><td>

Shorthand version of [verbose](./rlog.rlog.verbose.md)<!-- -->.


</td></tr>
<tr><td>

[verbose(message, data)](./rlog.rlog.verbose.md)


</td><td>


</td><td>

Logs a verbose message.


</td></tr>
<tr><td>

[w(message, data)](./rlog.rlog.w.md)


</td><td>


</td><td>

Shorthand version of [warning](./rlog.rlog.warning.md)<!-- -->.


</td></tr>
<tr><td>

[warn(message, data)](./rlog.rlog.warn.md)


</td><td>


</td><td>

Shorthand version of [warning](./rlog.rlog.warning.md)<!-- -->.


</td></tr>
<tr><td>

[warning(message, data)](./rlog.rlog.warning.md)


</td><td>


</td><td>

Logs a warning message.


</td></tr>
<tr><td>

[withConfig(config)](./rlog.rlog.withconfig.md)


</td><td>


</td><td>

Returns a new [RLog](./rlog.rlog.md) with the provided config merged with the existing config.


</td></tr>
<tr><td>

[withLogContext(context)](./rlog.rlog.withlogcontext.md)


</td><td>


</td><td>

Returns a new [RLog](./rlog.rlog.md) with the [context](./rlog.rlog.context.md) set to the provided context.


</td></tr>
<tr><td>

[withMinLogLevel(minLevel)](./rlog.rlog.withminloglevel.md)


</td><td>


</td><td>

Returns a new [RLog](./rlog.rlog.md) with the [minLogLevel](./rlog.rlogconfig.minloglevel.md) set to the provided level.

Messages below the minimum level will be ignored.


</td></tr>
<tr><td>

[withTag(tag)](./rlog.rlog.withtag.md)


</td><td>


</td><td>

Returns a new [RLog](./rlog.rlog.md) with the [tag](./rlog.rlogconfig.tag.md) set to the provided string.


</td></tr>
</tbody></table>