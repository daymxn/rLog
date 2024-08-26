---
id: rlog.robloxconsolesinkconfig
title: RobloxConsoleSinkConfig interface
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md)

## RobloxConsoleSinkConfig interface

Configuration options for [robloxConsoleSink()](./rlog.robloxconsolesink.md)<!-- -->.

**Signature:**

```typescript
export interface RobloxConsoleSinkConfig 
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

[disable?](./rlog.robloxconsolesinkconfig.disable.md)


</td><td>

`readonly`


</td><td>

boolean


</td><td>

_(Optional)_ Completely disable sending messages to the roblox console.

Can be used for quick toggling in debug or conditionally toggling the roblox console.


</td></tr>
<tr><td>

[formatMethod?](./rlog.robloxconsolesinkconfig.formatmethod.md)


</td><td>

`readonly`


</td><td>

[FormatMethodCallback](./rlog.formatmethodcallback.md)


</td><td>

_(Optional)_ Optional method to convert log entries to output.


</td></tr>
<tr><td>

[minLogLevel?](./rlog.robloxconsolesinkconfig.minloglevel.md)


</td><td>

`readonly`


</td><td>

[LogLevel](./rlog.loglevel.md)


</td><td>

_(Optional)_ The minimum [LogLevel](./rlog.loglevel.md) to send through to the roblox console.

Any logs with a level below this will not be sent to the roblox console, but will still be sent to other sinks.


</td></tr>
<tr><td>

[outputMethod?](./rlog.robloxconsolesinkconfig.outputmethod.md)


</td><td>

`readonly`


</td><td>

[OutputMethodCallback](./rlog.outputmethodcallback.md)


</td><td>

_(Optional)_ Optional method to send output to the roblox console.

By default, logs above [LogLevel.WARNING](./rlog.loglevel.md) will be sent through `warn`<!-- -->, and the rest through `print`<!-- -->.


</td></tr>
</tbody></table>