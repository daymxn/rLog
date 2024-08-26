---
id: rlog.robloxconsolesinkconfig.minloglevel
title: RobloxConsoleSinkConfig.minLogLevel property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RobloxConsoleSinkConfig](./rlog.robloxconsolesinkconfig.md) &gt; [minLogLevel](./rlog.robloxconsolesinkconfig.minloglevel.md)

## RobloxConsoleSinkConfig.minLogLevel property

The minimum [LogLevel](./rlog.loglevel.md) to send through to the roblox console.

Any logs with a level below this will not be sent to the roblox console, but will still be sent to other sinks.

**Signature:**

```typescript
readonly minLogLevel?: LogLevel;
```