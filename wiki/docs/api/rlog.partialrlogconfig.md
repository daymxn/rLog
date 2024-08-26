---
id: rlog.partialrlogconfig
title: PartialRLogConfig type
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [PartialRLogConfig](./rlog.partialrlogconfig.md)

## PartialRLogConfig type

Version of [RLogConfig](./rlog.rlogconfig.md) that allows all data to be absent.

**Signature:**

```typescript
export type PartialRLogConfig = Partial<ExcludeMembers<RLogConfig, SerializationConfig>> & {
    readonly serialization?: Partial<SerializationConfig>;
};
```
**References:** [RLogConfig](./rlog.rlogconfig.md)<!-- -->, [SerializationConfig](./rlog.serializationconfig.md)
