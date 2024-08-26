import Object from "@rbxts/object-utils";
import { LogEntry, LogLevel, sink } from "../common";
import { LogContext } from "./log-context";

// Context that had a warning sent through it, and will need to have their pending messages sent
const flaggedContext: Set<string> = new Set();

// Messages to send only if the context is flagged
const pendingMessages: Map<string, LogEntry[]> = new Map();

// Messages to send whenever the context is closed and the context is not flagged
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
  /**
   * Save a message to be sent later if the context is flagged.
   */
  export function save(message: LogEntry, context: LogContext) {
    const messages = pendingMessages.get(context.correlation_id) ?? [];

    pendingMessages.set(context.correlation_id, [...messages, message]);

    if (message.level >= LogLevel.WARNING) {
      flaggedContext.add(context.correlation_id);
    }
  }

  /**
   * Save a message to be sent later, regardless if the context is flagged.
   */
  export function push(message: LogEntry, context: LogContext) {
    save(message, context);
    const messages = promisedMessages.get(context.correlation_id) ?? [];

    promisedMessages.set(context.correlation_id, [...messages, message]);
  }

  /**
   * Mark a context as "flagged", meaning a warning message was sent through it.
   *
   * So whenever the context is closed all pending messages should be sent.
   */
  export function flag(message: LogEntry) {
    if (message.context) {
      flaggedContext.add(message.context.correlation_id);
    }
  }

  /**
   * Send all the pending messages for a context.
   *
   * To be called when the context is stopped.
   */
  export function flush(context: LogContext | string) {
    const id = typeIs(context, "string") ? context : context.correlation_id;
    const entries = getMessages(id);
    if (entries) {
      if (entries.isEmpty()) {
        warn(
          "rLog Context Manager doesn't have any messages for a context. This shouldn't happen.",
          "\nCorrelation ID:",
          id
        );
      }

      for (const pending of entries) {
        sink(pending, pending.config.sinks ?? []);
      }
    }

    flaggedContext.delete(id);
    pendingMessages.delete(id);
    promisedMessages.delete(id);
  }

  export function clear() {
    flaggedContext.clear();
    pendingMessages.clear();
  }

  /**
   * Flag all current contexts, and flush them.
   *
   * Intended to be called before a game closes to avoid losing logs.
   */
  export function forceFlush() {
    const contexts = Object.keys(pendingMessages);
    for (const context of contexts) {
      flaggedContext.add(context);
      flush(context);
    }
    pendingMessages.clear();
  }
}
