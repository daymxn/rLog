---
id: rlog.robloxconsolesinkconfig.formatmethod
title: RobloxConsoleSinkConfig.formatMethod property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md) &gt; [formatMethod](./rlog.robloxconsolesinkconfig.formatmethod.md)

## RobloxConsoleSinkConfig.formatMethod property

Optional method to convert log entries to output.

**Signature:**

```typescript
readonly formatMethod?: FormatMethodCallback;
```

## Example


```ts
export const customFormatMethod: FormatMethodCallback = (entry) => {
  return $tuple(entry.message, entry.encoded_data);
};
```
