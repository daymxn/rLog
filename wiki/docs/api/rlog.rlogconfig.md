---
id: rlog.rlogconfig
title: RLogConfig interface
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md)

## RLogConfig interface

Configuration settings for [RLog](./rlog.rlog.md)<!-- -->.

**Signature:**

```typescript
export interface RLogConfig 
```

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

[contextBypass](./rlog.rlogconfig.contextbypass.md)


</td><td>

`readonly`


</td><td>

boolean


</td><td>

Allows logs that have context to bypass [minLogLevel](./rlog.rlogconfig.minloglevel.md) under certain circumstances.


</td></tr>
<tr><td>

[correlationGenerator?](./rlog.rlogconfig.correlationgenerator.md)


</td><td>

`readonly`


</td><td>

() =&gt; string


</td><td>

_(Optional)_ Function to generate correlation IDs.


</td></tr>
<tr><td>

[enrichers?](./rlog.rlogconfig.enrichers.md)


</td><td>

`readonly`


</td><td>

[LogEnricherCallback](./rlog.logenrichercallback.md)<!-- -->\[\]


</td><td>

_(Optional)_ An array of [LogEnricherCallback](./rlog.logenrichercallback.md) to call whenever sending a message.


</td></tr>
<tr><td>

[minLogLevel](./rlog.rlogconfig.minloglevel.md)


</td><td>

`readonly`


</td><td>

[LogLevel](./rlog.loglevel.md)


</td><td>

Sets the minimum [LogLevel](./rlog.loglevel.md) for data to be logged.

Messages below the minimum level will be ignored.


</td></tr>
<tr><td>

[serialization](./rlog.rlogconfig.serialization.md)


</td><td>

`readonly`


</td><td>

[SerializationConfig](./rlog.serializationconfig.md)


</td><td>

Settings to use when encoding [data](./rlog.logentry.data.md) in logs.


</td></tr>
<tr><td>

[sinks?](./rlog.rlogconfig.sinks.md)


</td><td>

`readonly`


</td><td>

[LogSinkCallback](./rlog.logsinkcallback.md)<!-- -->\[\]


</td><td>

_(Optional)_ An array of [LogSinkCallback](./rlog.logsinkcallback.md) to call whenever sending a message.


</td></tr>
<tr><td>

[suspendContext](./rlog.rlogconfig.suspendcontext.md)


</td><td>

`readonly`


</td><td>

boolean


</td><td>

Prevents logs from propogating until the context is killed.


</td></tr>
<tr><td>

[tag?](./rlog.rlogconfig.tag.md)


</td><td>

`readonly`


</td><td>

string


</td><td>

_(Optional)_ String to prefix to all logs.

Will be followed by a `->` between the log message and the log level.


</td></tr>
</tbody></table>