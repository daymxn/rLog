---
id: rlog.robloxconsolesink
title: robloxConsoleSink() function
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [robloxConsoleSink](./rlog.robloxconsolesink.md)

## robloxConsoleSink() function

The default sink for sending messages to the roblox console.

**Signature:**

```typescript
export declare function robloxConsoleSink(params?: RobloxConsoleSinkConfig): (entry: LogEntry) => void;
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

params


</td><td>

[RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md)


</td><td>

_(Optional)_ [RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md) options for this sink.


</td></tr>
</tbody></table>
**Returns:**

(entry: [LogEntry](./rlog.logentry.md)<!-- -->) =&gt; void

A sink that should be added to a config.

## Remarks

By default, this is already applied at the root level through the default instance.

## Example


```ts
const logger = new rLog({
  sinks: [
     robloxConsoleSink({ formatMethod: myCustomMethod }),
  ],
});
```
