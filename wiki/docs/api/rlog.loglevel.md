---
id: rlog.loglevel
title: LogLevel enum
hide_title: true
---

[@rbxts/rlog](./rlog.md) &gt; [LogLevel](./rlog.loglevel.md)

## LogLevel enum

Enum representing the various log levels, or "importance" of a [LogEntry](./rlog.logentry.md)<!-- -->.

**Signature:**

```typescript
export declare enum LogLevel 
```

## Enumeration Members

<table><thead><tr><th>

Member


</th><th>

Value


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

VERBOSE


</td><td>

`0`


</td><td>

The lowest level of logging.

Verbose messages are those that are not usually useful unless you need to see deep step-by-step processes in your application.


</td></tr>
<tr><td>

DEBUG


</td><td>

`1`


</td><td>

The second lowest level of logging.

Generally used for messages that you don't necessarily need to see at runtime, but they're useful when you need to find out why something is happening.


</td></tr>
<tr><td>

INFO


</td><td>

`2`


</td><td>

The baseline level of logging.

Useful for messages that signify an event or interaction. Usually occur only once or twice in a control flow, and are used less for debugging, and more for seeing what's going on in your application.


</td></tr>
<tr><td>

WARNING


</td><td>

`3`


</td><td>

Not as bad as an [ERROR](./rlog.loglevel.md)<!-- -->, but something that you should be looked at.

Useful for situations where something isn't necessarily breaking, but it's behaving in a way that isn't desired.


</td></tr>
<tr><td>

ERROR


</td><td>

`4`


</td><td>

The highest level of logging.

Used to indicate issues or exceptions that broke the application, and need to be fixed.


</td></tr>
</tbody></table>