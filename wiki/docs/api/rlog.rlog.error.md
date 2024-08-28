---
id: rlog.rlog.error
title: RLog.error() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [error](./rlog.rlog.error.md)

## RLog.error() method

Logs an error message.

**Signature:**

```typescript
error(message: string, data?: LogData): void;
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
[ERROR]: Hello World!
{ data: { player: "Player1" } }
```
