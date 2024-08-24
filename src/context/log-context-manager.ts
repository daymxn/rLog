import { LogEntry, LogLevel, sink } from "../common";
import { LogContext } from "../rlog";

const flaggedContext: Set<string> = new Set();
const pendingMessages: Map<string, LogEntry[]> = new Map();
const promisedMessages: Map<string, LogEntry[]> = new Map();

function getMessages(correlation: string) {
  if (flaggedContext.has(correlation)) {
    return pendingMessages.get(correlation) ?? [];
  } else if (promisedMessages.has(correlation)) {
    return promisedMessages.get(correlation) ?? [];
  }
  return undefined;
}

/** @internal */
export namespace LogContextManager {
  // save to send later
  export function save(message: LogEntry, context: LogContext) {
    const messages = pendingMessages.get(context.correlation_id) ?? [];

    pendingMessages.set(context.correlation_id, [...messages, message]);

    if (message.level >= LogLevel.WARNING) {
      flaggedContext.add(context.correlation_id);
    }
  }

  export function push(message: LogEntry, context: LogContext) {
    save(message, context);
    const messages = promisedMessages.get(context.correlation_id) ?? [];

    promisedMessages.set(context.correlation_id, [...messages, message]);
  }

  export function flag(message: LogEntry) {
    if (message.context) {
      flaggedContext.add(message.context.correlation_id);
    }
  }

  // to be called when a context is closed. try to process it.
  export function flush(context: LogContext) {
    const entries = getMessages(context.correlation_id);
    if (entries) {
      if (entries.isEmpty()) {
        warn(
          "rLog Context Manager doesn't have any messages for a context. This shouldn't happen.",
          "\nCorrelation ID:",
          context.correlation_id
        );
      }

      for (const pending of entries) {
        sink(pending, pending.config.sinks ?? []);
      }
    }

    flaggedContext.delete(context.correlation_id);
    pendingMessages.delete(context.correlation_id);
    promisedMessages.delete(context.correlation_id);
  }

  export function clear() {
    flaggedContext.clear();
    pendingMessages.clear();
  }

  // TODO(): export as a method in rLog. user has to call it.
  // otherwise, we could end up closing context that the user already bound to close to do
  export function forceFlush() {
    // TODO(): implement
  }
}
