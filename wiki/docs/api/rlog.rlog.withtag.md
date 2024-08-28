---
id: rlog.rlog.withtag
title: RLog.withTag() method
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLog](./rlog.rlog.md) &gt; [withTag](./rlog.rlog.withtag.md)

## RLog.withTag() method

Returns a new [RLog](./rlog.rlog.md) with the [tag](./rlog.rlogconfig.tag.md) set to the provided string.

**Signature:**

```typescript
withTag(tag: string): RLog;
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

tag


</td><td>

string


</td><td>

The new tag to use.


</td></tr>
</tbody></table>
**Returns:**

[RLog](./rlog.rlog.md)

The new [RLog](./rlog.rlog.md) instance.

## Remarks

Tags are appended to log messages when present, for easier filtering.

Usually, they're used at the class or module level to keep track of all logs facilitated by a single service or action.

## Example


```ts
let logger = new RLog();

logger.d("Hello world!");
// > [DEBUG]: "Hello world!"

logger = logger.withTag("main");

logger.d("Hello world!");
// > [DEBUG]: main -> "Hello world!"
```
