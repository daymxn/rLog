---
id: rlog.logenrichercallback
title: LogEnricherCallback type
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogEnricherCallback](./rlog.logenrichercallback.md)

## LogEnricherCallback type

Type representing a callback function for enriching log entries, or an "enricher".

Enrichers optionally mutate [LogEntry](./rlog.logentry.md)<!-- -->s. You can add data to a [LogEntry](./rlog.logentry.md)<!-- -->, edit its [metadata](./rlog.logentry.source_metadata.md)<!-- -->, or just return it if you don't need to do anything.

**Signature:**

```typescript
export type LogEnricherCallback = (entry: LogEntry) => LogEntry;
```
**References:** [LogEntry](./rlog.logentry.md)
