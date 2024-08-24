import { RLogConfig } from "../configuration";
import { LogContext, RLog } from "../rlog";

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
  encoded_data: LogData;

  config: Writable<RLogConfig>;

  context?: LogContext;
  timestamp: number;
  source_metadata: SourceMetadata;
};

/**
 * Type representing a callback function for consuming log entries, or a "sink".
 *
 * Sinks optionally consume {@link LogEntry}s. If you return `true`,
 * then the log will be stopped, and no further sinks will be called. The {@link LogEntry} will
 * also not be logged to the console.
 *
 * To learn more about sinks, and how they work, see {@link RLog.withSink | withSink}.
 *
 * @param entry - The log entry to handle.
 * @param attachment - The instance for where this sink is attached.
 * @param source - The instance for where this event is occuring.
 *
 * @returns A boolean indicating whether the log was consumed, or void.
 *
 * @public
 */
export type LogSinkCallback = (entry: LogEntry) => boolean | void;

// TODO(): documentation
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
 * To learn more about enrichers, and how they work, see {@link RLog.withEnricher | withEnricher}.
 *
 * @param entry - The log entry to enrich.
 * @param attachment - The instance for where this enricher is attached.
 * @param source - The instance for where this event is occuring.
 *
 * @returns The enriched log entry.
 *
 * @public
 */
export type LogEnricherCallback = (entry: LogEntry) => LogEntry;

// TODO(): documentation
export function enrich(entry: LogEntry, enrichers: LogEnricherCallback[]): LogEntry {
  return enrichers.reduce<LogEntry>((log, enricher) => enricher(log), entry);
}

/**
 * Type representing a callback function for converting log entries to output.
 *
 * @param entry - The log entry to convert.
 *
 * @returns Any amount of arguments to output in the entry's place
 *
 * @public
 */
export type FormatMethodCallback = (entry: LogEntry) => LuaTuple<unknown[]>;

// TODO(): document
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
   * Can be used in place of {@link SourceContext.function_name | function_name} for getting an idea of what's
   * going on, even in anonymous functions.
   *
   * If {@link SourceContext.function_name | function_name} is present, this value will be the same.
   */
  nearest_function_name?: string;

  /**
   * The full name of the file where this was created.
   */
  file_path: string;

  /**
   * The line number in the file where this was created.
   */
  line_number: number;
};
