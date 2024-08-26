---
id: rlog.rlogconfig.tag
title: RLogConfig.tag property
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [RLogConfig](./rlog.rlogconfig.md) &gt; [tag](./rlog.rlogconfig.tag.md)

## RLogConfig.tag property

String to prefix to all logs.

Will be followed by a `->` between the log message and the log level.

**Signature:**

```typescript
readonly tag?: string;
```

## Remarks

This setting is ignored when merging configs.

## Example


```ts
const logger = new RLog({ tag: "Main" });

logger.i("Hello world!");
// > [INFO]: Main -> Hello world!
```
