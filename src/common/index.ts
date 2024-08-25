import { RLogConfig } from "../configuration";
import { LogContext } from "../context";

/**
 * Enum representing the various log levels, or "importance" of a {@link LogEntry}.
 *
 * @public
 */
export enum LogLevel {
  /**
   * The lowest level of logging.
   *
   * Verbose messages are those that are not usually useful
   * unless you need to see deep step-by-step processes in your
   * application.
   */
  VERBOSE,

  /**
   * The second lowest level of logging.
   *
   * Generally used for messages that you don't necessarily
   * need to see at runtime, but they're useful when you need
   * to find out why something is happening.
   */
  DEBUG,

  /**
   * The baseline level of logging.
   *
   * Useful for messages that signify an event or interaction.
   * Usually occur only once or twice in a control flow, and are used
   * less for debugging, and more for seeing what's going on in your application.
   */
  INFO,

  /**
   * Not as bad as an {@link LogLevel.ERROR | ERROR}, but something that you should be looked at.
   *
   * Useful for situations where something isn't necessarily breaking, but it's behaving
   * in a way that isn't desired.
   */
  WARNING,

  /**
   * The highest level of logging.
   *
   * Used to indicate issues or exceptions that broke the application, and need to be fixed.
   */
  ERROR,
}

/**
 * Type representing the additional data associated with a log entry.
 *
 * @public
 */
export type LogData = Record<string, unknown>;

/**
 * A single logging event.
 *
 * Each message has its own instance of this, with relevant data
 * attached.
 *
 * @public
 */
export type LogEntry = {
  /** The log level of the entry. */
  level: LogLevel;

  /** The message associated with the log entry. */
  message: string;

  /** Additional data associated with the log entry. */
  data: LogData;

  /** Additional data associated with the log entry, encoded to be presentable in the roblox console. */
  encoded_data: LogData;

  /** A `Writable` version of the config that was used when sending the log entry. */
  config: Writable<RLogConfig>;

  /** The context used when sending the log, if there was one present at all. */
  context?: LogContext;

  /** The epoch milliseconds in which the log occurred. */
  timestamp: number;

  /** Metadata detailing where in the source this log occurred. */
  source_metadata: SourceMetadata;
};

/**
 * Type representing a callback function for consuming log entries, or a "sink".
 *
 * Sinks optionally consume {@link LogEntry}s. If you return `true`,
 * then the log will be stopped, and no further sinks will be called. The {@link LogEntry} will
 * also not be logged to the console.
 *
 * Sinks are generally used to send logs to an external database or service, but they can
 * also be used to filter logs by "consuming" them.
 *
 * **Note:** you should not yield in sinks. If you're sending data to an external service, do
 * so via queue that gets dispatched in a different thread.
 *
 * @param entry - The log entry to handle.
 *
 * @returns `true` if the log was consume, `false` or `void` otherwise.
 *
 * @public
 *
 * @example
 * ```ts
 * const logger = new rLog({
 * sinks: [
 *   (entry) => {
 *      someExternalDBFunction(entry);
 *   },
 *   (entry) => {
 *     return true;
 *   },
 *   (entry) => {
 *     // never reaches because the previous sink returned true
 *     error("Messages should not log to the console");
 *   },
 * ],
 * });
 *
 * logger.i("Hello world!");
 * ```
 */
export type LogSinkCallback = (entry: LogEntry) => boolean | void;

/**
 * Runs a log through all the provided sinks, stopping if any return true.
 *
 * @param entry - Log to send through the sinks.
 * @param sinks - Collection of {@link LogSinkCallback} to call with the entry.
 *
 * @internal
 *
 * @throws If sinks is empty, as there's nowhere to send the log.
 */
export function sink(entry: LogEntry, sinks: LogSinkCallback[]) {
  if (sinks.isEmpty()) {
    warn("rLog entry is missing sinks. I don't have anywhere to send this message.\n", entry.message);
    return;
  }

  sinks.some((sinker) => sinker(entry) === true);
}

/**
 * Type representing a callback function for enriching log entries, or an "enricher".
 *
 * Enrichers optionally mutate {@link LogEntry}s. You can add data to a {@link LogEntry},
 * edit its {@link LogEntry.source_metadata | metadata}, or just return it if you don't need to
 * do anything.
 *
 * @param entry - The log entry to enrich.
 *
 * @returns The enriched log entry.
 *
 * @public
 */
export type LogEnricherCallback = (entry: LogEntry) => LogEntry;

/**
 * Runs a log through all the provided enrichers, folding the value along the way.
 *
 * @param entry - Log to send through the enrichers.
 * @param enrichers - Collection of {@link LogEnricherCallback} to call with the entry.
 *
 * @internal
 *
 * @returns The final log entry, after being folded across all the enrichers.
 */
export function enrich(entry: LogEntry, enrichers: LogEnricherCallback[]): LogEntry {
  return enrichers.reduce<LogEntry>((log, enricher) => enricher(log), entry);
}

/**
 * Type representing a callback function for converting log entries to output.
 *
 * @param entry - The log entry to convert.
 *
 * @returns A tuple of of arguments to output in the entry's place
 *
 * @public
 */
export type FormatMethodCallback = (entry: LogEntry) => LuaTuple<unknown[]>;

/**
 * Metadata used in identifying _where_ in the source code a log occurred.
 *
 * @public
 */
export type SourceMetadata = {
  /**
   * The name of the function where this was created.
   *
   * May be undefined if this was created within an anonymous function.
   */
  function_name?: string;

  /**
   * The nearest function name of where this was created.
   *
   * May be undefined if we can't find one (such as reaching max depth, or a stack full of anonymous functions)
   *
   * Can be used in place of {@link SourceMetadata.function_name | function_name} for getting an idea of what's
   * going on, even in anonymous functions.
   *
   * If {@link SourceMetadata.function_name | function_name} is present, this value will be the same.
   */
  nearest_function_name?: string;

  /**
   * The full name of the file where this was created.
   */
  file_path: string;

  /**
   * The line number in the file where this was created.
   *
   * This will be the line number in the translated luau code- _not_ the TS line number.
   */
  line_number: number;
};
