---
id: rlog.robloxconsolesinkconfig.outputmethod
title: RobloxConsoleSinkConfig.outputMethod property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md) &gt; [outputMethod](./rlog.robloxconsolesinkconfig.outputmethod.md)

## RobloxConsoleSinkConfig.outputMethod property

Optional method to send output to the roblox console.

By default, logs above [LogLevel.WARNING](./rlog.loglevel.md) will be sent through `warn`<!-- -->, and the rest through `print`<!-- -->.

**Signature:**

```typescript
readonly outputMethod?: OutputMethodCallback;
```

## Example


```ts
export const customOutputMethod: OutputMethodCallback = (entry, messages) => {
  print(...messages);
};
```
