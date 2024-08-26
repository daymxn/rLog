[Home](./index.md) &gt; [@rbxts/rlog](./rlog.md) &gt; [SourceMetadata](./rlog.sourcemetadata.md)

## SourceMetadata type

Metadata used in identifying \_where\_ in the source code a log occurred.

**Signature:**

```typescript
export type SourceMetadata = {
  function_name?: string;
  nearest_function_name?: string;
  file_path: string;
  line_number: number;
};
```
