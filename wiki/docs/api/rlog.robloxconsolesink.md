[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [robloxConsoleSink](./rlog.robloxconsolesink.md)

## robloxConsoleSink() function

The default sink for sending messages to the roblox console.

By default, this is already applied at the root level through the default instance.

**Signature:**

```typescript
export declare function robloxConsoleSink({
  formatMethod,
  outputMethod,
  minLogLevel,
  disable,
}?: RobloxConsoleSinkConfig): (entry: LogEntry) => void;
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

{ formatMethod, outputMethod, minLogLevel, disable }

</td><td>

[RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md)

</td><td>

_(Optional)_

</td></tr>
</tbody></table>
**Returns:**

(entry: [LogEntry](./rlog.logentry.md)<!-- -->) =&gt; void

A sink that should be added to a config.

## Example

```ts
const logger = new rLog({
  sinks: [robloxConsoleSink({ formatMethod: myCustomMethod })],
});
```
