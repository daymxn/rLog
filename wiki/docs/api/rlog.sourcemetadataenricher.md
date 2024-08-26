[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [sourceMetadataEnricher](./rlog.sourcemetadataenricher.md)

## sourceMetadataEnricher() function

Attaches to the output of a log entry.

The metadata is attached under the `source_metadata` key in .

If a value is `undefined`<!-- -->, it will not be populated.

**Signature:**

```typescript
export declare function sourceMetadataEnricher(entry: LogEntry): LogEntry;
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

entry

</td><td>

[LogEntry](./rlog.logentry.md)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

[LogEntry](./rlog.logentry.md)

## Example

```log
[INFO]: Actions -> Hello world!
{
  data: {
    source_metadata: {
      function_name: "doAction",
      nearest_function_name: "doAction",
      file_path: "ReplicatedStorage.TS.actions",
      line_number: 5
    }
  }
}
```
