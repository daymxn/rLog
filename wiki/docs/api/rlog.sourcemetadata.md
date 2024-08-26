---
id: rlog.sourcemetadata
title: SourceMetadata interface
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [SourceMetadata](./rlog.sourcemetadata.md)

## SourceMetadata interface

Metadata used in identifying _where_ in the source code a log occurred.

**Signature:**

```typescript
export interface SourceMetadata 
```

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[file_path](./rlog.sourcemetadata.file_path.md)


</td><td>


</td><td>

string


</td><td>

The full name of the file where this was created.


</td></tr>
<tr><td>

[function_name?](./rlog.sourcemetadata.function_name.md)


</td><td>


</td><td>

string


</td><td>

_(Optional)_ The name of the function where this was created.


</td></tr>
<tr><td>

[line_number](./rlog.sourcemetadata.line_number.md)


</td><td>


</td><td>

number


</td><td>

The line number in the file where this was created.


</td></tr>
<tr><td>

[nearest_function_name?](./rlog.sourcemetadata.nearest_function_name.md)


</td><td>


</td><td>

string


</td><td>

_(Optional)_ The nearest function name of where this was created.


</td></tr>
</tbody></table>