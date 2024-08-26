[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [log](./rlog.rlog.log.md)

## RLog.log() method

Logs a message with a specified log level.

**Signature:**

```typescript
log(level: LogLevel, message: string, data?: LogData): void;
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

level

</td><td>

[LogLevel](./rlog.loglevel.md)

</td><td>

The severity of the log.

</td></tr>
<tr><td>

message

</td><td>

string

</td><td>

The core message of the log.

</td></tr>
<tr><td>

data

</td><td>

[LogData](./rlog.logdata.md)

</td><td>

_(Optional)_ Optional data to log. Will be encoded according to this logger's [config](./rlog.rlogconfig.md)<!-- -->.

</td></tr>
</tbody></table>
**Returns:**

void
