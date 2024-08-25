import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";
import { LogEntry, LogLevel } from "../common";

/**
 * Type representing a callback function for converting log entries to output.
 *
 * @param entry - The log entry to convert.
 *
 * @returns A tuple of arguments to output in the entry's place
 *
 * @public
 */
export type FormatMethodCallback = (entry: LogEntry) => LuaTuple<unknown[]>;

/**
 * Type representing a callback function for sending a log to the roblox console.
 *
 * @param entry - The entry from where this log came from.
 * @param messages - A tuple of arguments to output in the entry's place.
 *
 * @public
 */
export type OutputMethodCallback = (entry: LogEntry, messages: LuaTuple<unknown[]>) => void;

/**
 * Configuration options for {@link robloxConsoleSink}.
 *
 * @public
 */
export type RobloxConsoleSinkConfig = {
  /**
   * Optional method to convert log entries to output.
   *
   * @see {@link RobloxConsoleSinkConfig.outputMethod}
   *
   * @example
   * ```ts
   * export const customFormatMethod: FormatMethodCallback = (entry) => {
   *   return $tuple(entry.message, entry.encoded_data);
   * };
   * ```
   */
  readonly formatMethod?: FormatMethodCallback;

  /**
   * Optional method to send output to the roblox console.
   *
   * By default, logs above {@link LogLevel.WARNING} will be sent
   * through `warn`, and the rest through `print`.
   *
   * @see {@link RobloxConsoleSinkConfig.formatMethod}
   *
   * @example
   * ```ts
   * export const customOutputMethod: OutputMethodCallback = (entry, messages) => {
   *   print(...messages);
   * };
   * ```
   */
  readonly outputMethod?: OutputMethodCallback;

  /**
   * The minimum {@link LogLevel} to send through to the roblox console.
   *
   * Any logs with a level below this will not be sent to the roblox console, but will
   * still be sent to other sinks.
   */
  readonly minLogLevel?: LogLevel;

  /**
   * Completely disable sending messages to the roblox console.
   *
   * Can be used for quick toggling in debug or conditionally toggling
   * the roblox console.
   */
  readonly disable?: boolean;
};

/**
 * The default sink for sending messages to the roblox console.
 *
 * By default, this is already applied at the root level through the default instance.
 *
 * @param param0 - Optional {@link RobloxConsoleSinkConfig} options for this sink.
 *
 * @returns A sink that should be added to a config.
 *
 * @example
 * ```ts
 * const logger = new rLog({
 *   sinks: [
 *      robloxConsoleSink({ formatMethod: myCustomMethod }),
 *   ],
 * });
 * ```
 */
export function robloxConsoleSink({ formatMethod, outputMethod, minLogLevel, disable }: RobloxConsoleSinkConfig = {}) {
  return (entry: LogEntry) => {
    if (disable) return;
    if (minLogLevel !== undefined && entry.level < minLogLevel) return;

    const formatEntry = formatMethod ?? defaultFormatEntry;
    const outputEntry = outputMethod ?? defaultOutputEntry;

    const output = formatEntry(entry);

    outputEntry(entry, output);
  };
}

const defaultOutputEntry: OutputMethodCallback = (entry, messages) => {
  if (entry.level >= LogLevel.WARNING) {
    warn(...messages);
  } else {
    print(...messages);
  }
};

function defaultFormatEntry(entry: LogEntry) {
  const tag = entry.config.tag !== undefined ? `${entry.config.tag} -> ` : "";

  const data = {
    correlation_id: entry.context?.correlation_id,
    timestamp: entry.timestamp,
    data: Object.isEmpty(entry.encoded_data) ? undefined : entry.encoded_data,
  };

  return $tuple(`[${LogLevel[entry.level]}]:`, `${tag}${entry.message}\n${HttpService.JSONEncode(data)}`);
}
