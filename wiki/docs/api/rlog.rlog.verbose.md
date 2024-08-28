---
id: rlog.rlog.verbose
title: RLog.verbose() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [verbose](./rlog.rlog.verbose.md)

## RLog.verbose() method

Logs a verbose message.

**Signature:**

```typescript
verbose(message: string, data?: LogData): void;
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
[VERBOSE]: Hello World!
{ data: { player: "Player1" } }
```
