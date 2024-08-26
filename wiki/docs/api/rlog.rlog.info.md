[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [info](./rlog.rlog.info.md)

## RLog.info() method

Logs an informational message.

**Signature:**

```typescript
info(message: string, data?: LogData): void;
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

message

</td><td>

string

</td><td>

The message to log.

</td></tr>
<tr><td>

data

</td><td>

[LogData](./rlog.logdata.md)

</td><td>

_(Optional)_ Optional data to log.

</td></tr>
</tbody></table>
**Returns:**

void

## Example

```log
[INFO]: Hello World!
{ data: { player: "Player1" } }
```
