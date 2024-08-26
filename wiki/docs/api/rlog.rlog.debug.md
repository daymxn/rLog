---
id: rlog.rlog.debug
title: RLog.debug() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [debug](./rlog.rlog.debug.md)

## RLog.debug() method

Logs a debug message.

**Signature:**

```typescript
debug(message: string, data?: LogData): void;
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

_(Optional)_ Data to log.


</td></tr>
</tbody></table>
**Returns:**

void

## Example


```log
[DEBUG]: Hello World!
{ data: { player: "Player1" } }
```
