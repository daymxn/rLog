[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [warning](./rlog.rlog.warning.md)

## RLog.warning() method

Logs a warning message.

**Signature:**

```typescript
warning(message: string, data?: LogData): void;
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
[WARNING]: Hello World!
{ data: { player: "Player1" } }
```
