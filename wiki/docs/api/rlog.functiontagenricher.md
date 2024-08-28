---
id: rlog.functiontagenricher
title: functionTagEnricher() function
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [functionTagEnricher](./rlog.functiontagenricher.md)

## functionTagEnricher() function

Enricher for adding a tag to a log matching the function name, if absent.

**Signature:**

```typescript
export declare function functionTagEnricher(entry: LogEntry): LogEntry;
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

## Remarks

If the entry doesn't have a tag, then this enricher will use the [nearest_function_name](./rlog.sourcemetadata.nearest_function_name.md) of where log occurred instead.

## Example


```ts
const logger = new RLog({ enrichers: [functionTagEnricher] });

function CoolFunction() {
 logger.i("Hello world!");
}

CoolFunction();
// > [INFO]: CoolFunction -> Hello world!
```
