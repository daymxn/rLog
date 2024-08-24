import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";
import { LogEntry, LogLevel } from "../common";

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
export type OutputMethodCallback = (entry: LogEntry, messages: LuaTuple<unknown[]>) => void;

// TODO(): document
export type RobloxConsoleSinkConfig = {
  formatMethod?: FormatMethodCallback;
  outputMethod?: OutputMethodCallback;
  minLogLevel?: LogLevel;
  disable?: boolean;
};

// TODO(): document
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
