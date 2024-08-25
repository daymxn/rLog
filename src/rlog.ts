import { enrich, LogData, LogEntry, LogLevel, sink, SourceMetadata } from "./common";
import { mergeConfigs, PartialRLogConfig, RLogConfig } from "./configuration";
import type { LogContext } from "./context";
import { LogContextManager } from "./context/log-context-manager";
import { serialize } from "./serialization";
import { robloxConsoleSink } from "./sinks";

const FILE_NAME = debug.info(1, "s")[0];

/**
 * Table version of the constructor parameters for {@link RLog}.
 *
 * @public
 */
export type RLogConstructorParameters = {
  config?: PartialRLogConfig;
  context?: LogContext;
  inheritDefault?: boolean;
};

function isConstructorParameters(value: object): value is RLogConstructorParameters {
  return "config" in value || "context" in value || "inheritDefault" in value;
}

function extractSourceMetadata(): SourceMetadata {
  const metadata = {} as Writable<Partial<SourceMetadata>>;

  let stack_level = 3;
  let file;

  do {
    const [file, line, func] = debug.info(stack_level++, "sln");
    if (file === FILE_NAME) continue;

    if (metadata.file_path === undefined) {
      metadata.file_path = file;
      metadata.function_name = func;
      metadata.line_number = line;
    }
    metadata.nearest_function_name ??= func;
  } while (file !== undefined && metadata.nearest_function_name === undefined);

  return metadata as SourceMetadata;
}

/**
 * Class for Server-Side Roblox Logging.
 *
 * You can also use {@link rlog} or {@link rLog}- for style purposes.
 *
 * @public
 */
export class RLog {
  /**
   * @internal
   * @readonly
   */
  public _config: RLogConfig;

  /**
   * The {@link LogContext} assigned to this instance, if any.
   *
   * Log context provides a way to carry Correlation IDs through-out
   * logs in an individual flow.
   *
   * To learn more about what that means, you can look at the docs
   * for {@link LogContext}.
   *
   * @see {@link RLog.withLogContext | withLogContext}
   */
  public readonly context: LogContext | undefined;

  /**
   * The default or "global" {@link RLog} instance.
   *
   * All loggers inherit from this, so it's a convenient way for
   * attaching global sinks, enrichers, or configuration.
   */
  public static readonly default = new RLog({ sinks: [robloxConsoleSink()] }, undefined);

  /**
   * Constructs a new {@link RLog} instance.
   *
   * @param config - Configuration settings to use for this logger instance.
   * @param context - The {@link LogContext} to use as a base for this instance.
   * @param inheritDefault - Whether to merge configs with the {@link RLog.default | default instance}. Defaults to true.
   */
  public constructor(config?: PartialRLogConfig, context?: LogContext, inheritDefault?: boolean);

  /**
   * Constructs a new {@link RLog} instance.
   *
   * Uses the provided table in place of the argument names.
   */
  public constructor({ config, context, inheritDefault }: RLogConstructorParameters);

  public constructor(
    config: PartialRLogConfig | RLogConstructorParameters = {},
    context?: LogContext,
    inheritDefault: boolean = true
  ) {
    if (isConstructorParameters(config)) {
      context = config.context;
      inheritDefault = config.inheritDefault ?? true;
      config = config.config ?? {};
    }

    this._config = mergeConfigs(inheritDefault ? RLog.default?._config : undefined, context?.config, config);
    if (context) {
      this.context = context.withConfig(this._config);
    }
  }

  /**
   * Overwrites the config for the {@link RLog.default | default} instance.
   *
   * You will rarely need to use this, and generally will want to be using
   * {@link RLog.UpdateDefaultConfig | UpdateDefaultConfig} insted.
   *
   * @param config - The {@link RLogConfig} to use.
   *
   * @see {@link RLog.UpdateDefaultConfig | UpdateDefaultConfig}, {@link RLog.ResetDefaultConfig | ResetDefaultConfig}
   */
  public static SetDefaultConfig(config: PartialRLogConfig) {
    this.default._config = mergeConfigs(config);
  }

  /**
   * Merges the given config with the existing config for the {@link RLog.default | default} instance.
   *
   * Since all {@link RLog} instances inherit their config from the default instance,
   * this is a convenient way to provide default configuration settings.
   *
   * @param config - The {@link RLogConfig} to use.
   *
   * @see {@link RLog.UpdateDefaultConfig | SetDefaultConfig}, {@link RLog.ResetDefaultConfig | ResetDefaultConfig}
   *
   * @example
   * ```ts
   * RLog.UpdateDefaultConfig({ serialization: { encodeFunctions: true } });
   *
   * // Inherits the `encodeFunctions` setting automatically
   * const logger = new RLog({ serialization: { encodeRobloxTypes: false } });
   *
   * logger.i("Player died", { player: player, location: player.Position, revive: () => {} });
   * // > [INFO]: Player died
   * // > { "data": { "player": 1338, "location": "<Vector3>", "revive": "<Function>" } }
   * ```
   */
  public static UpdateDefaultConfig(config: PartialRLogConfig) {
    this.default._config = mergeConfigs(this.default._config, config);
  }

  /**
   * Resets the config for the {@link RLog.default | default} instance to the original settings.
   *
   * Essentially would be the same as if you never touched the default config.
   *
   * @see {@link RLog.UpdateDefaultConfig | UpdateDefaultConfig}, {@link RLog.ResetDefaultConfig | SetDefaultConfig}
   */
  public static ResetDefaultConfig() {
    this.default._config = mergeConfigs({ sinks: [robloxConsoleSink()] });
  }

  /**
   * Force any pending messages to be sent through the sinks, regardless of the `minLogLevel`.
   *
   * Inteded to be called before the game closes, to ensure there are no missing logs.
   *
   * @see {@link LogContext}
   *
   * @example
   * ```ts
   * game.bindToClose(() => {
   *   RLog.ForceContextFlush();
   * });
   * ```
   */
  public static ForceContextFlush() {
    LogContextManager.forceFlush();
  }

  /**
   * Creates a new {@link RLog} instance with all the same settings and properties.
   *
   * Everything is deep copied, so any mutations to the original will safely not replicate.
   *
   * @returns A duplicate of this {@link RLog} instance.
   */
  public clone(): RLog;

  /**
   * Creates a new {@link RLog} instance with all the same settings and properties.
   *
   * The provided {@link RLogConstructorParameters | parameters} will be merged with
   * the existing parameters on this instance.
   *
   * Everything is deep copied, so any mutations to the original will safely not replicate.
   *
   * @returns A duplicate of this {@link RLog} instance.
   */
  public clone({ config, context }: RLogConstructorParameters): RLog;

  /**
   * Creates a new {@link RLog} instance with all the same settings and properties.
   *
   * Everything is deep copied, so any mutations to the original will safely not replicate.
   *
   * @param params - Optionally provide new arguments to merge with the new instance.
   *
   * @returns A duplicate of this {@link RLog} instance.
   */
  public clone(params: RLogConstructorParameters = {}): RLog {
    const config = mergeConfigs(this._config, params.config);

    return new RLog({ config: config, context: this.context });
  }

  /**
   * Logs a message with a specified log level.
   *
   * @param level - The severity of the log.
   * @param message - The core message of the log.
   * @param data - Optional data to log. Will be encoded according to this logger's {@link RLogConfig | config}.
   *
   * @see {@link RLog.verbose | verbose}, {@link RLog.debug | debug}, {@link RLog.info | info}, {@link RLog.warning | warning}, {@link RLog.error | error}
   */
  public log(level: LogLevel, message: string, data: LogData = {}) {
    let isOverride = false;
    if (this._config.minLogLevel > level) {
      if (!this.context || !this._config.contextBypass) return;
      isOverride = true;
    }

    const isFlag = this.context && level >= LogLevel.WARNING;

    const baseEntry: LogEntry = {
      level: level,
      message: message,
      data: data,
      encoded_data: serialize(this._config.serialization, data),
      config: this._config,
      context: this.context,
      timestamp: DateTime.now().UnixTimestampMillis,
      source_metadata: extractSourceMetadata(),
    };

    const enrichedEntry = enrich(baseEntry, this._config.enrichers ?? []);

    if (isOverride) {
      // enrichers could remove the context, which is allowed
      if (baseEntry.context) {
        LogContextManager.save(baseEntry, baseEntry.context);
      }
    } else {
      if (isFlag) {
        LogContextManager.flag(baseEntry);
      }
      if (baseEntry.config.suspendContext && baseEntry.context) {
        LogContextManager.push(baseEntry, baseEntry.context);
      } else {
        sink(enrichedEntry, baseEntry.config.sinks ?? []);
      }
    }
  }

  /**
   * Logs a verbose message.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   *
   * @see {@link RLog.v | v}
   *
   * @example
   * ```log
   * [VERBOSE]: Hello World!
   * { data: { player: "Player1" } }
   * ```
   */
  public verbose(message: string, data: LogData = {}) {
    this.log(LogLevel.VERBOSE, message, data);
  }

  /**
   * Shorthand version of {@link RLog.verbose | verbose}.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   */
  public v(message: string, data: LogData = {}) {
    this.verbose(message, data);
  }

  /**
   * Logs a debug message.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   *
   * @see {@link RLog.d | d}
   *
   * @example
   * ```log
   * [DEBUG]: Hello World!
   * { data: { player: "Player1" } }
   * ```
   */
  public debug(message: string, data: LogData = {}) {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Shorthand version of {@link RLog.debug | debug}.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   */
  public d(message: string, data: LogData = {}) {
    this.debug(message, data);
  }

  /**
   * Logs an informational message.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   *
   * @see {@link RLog.i | i}
   *
   * @example
   * ```log
   * [INFO]: Hello World!
   * { data: { player: "Player1" } }
   * ```
   */
  public info(message: string, data: LogData = {}) {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Shorthand version of {@link RLog.info | info}.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   */
  public i(message: string, data: LogData = {}) {
    this.info(message, data);
  }

  /**
   * Logs a warning message.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   *
   * @see {@link RLog.w | w}, {@link RLog.warn | warn}
   *
   * @example
   * ```log
   * [WARNING]: Hello World!
   * { data: { player: "Player1" } }
   * ```
   */
  public warning(message: string, data: LogData = {}) {
    this.log(LogLevel.WARNING, message, data);
  }

  /**
   * Shorthand version of {@link RLog.warning | warning}.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   */
  public warn(message: string, data: LogData = {}) {
    this.warning(message, data);
  }

  /**
   * Shorthand version of {@link RLog.warning | warning}.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   */
  public w(message: string, data: LogData = {}) {
    this.warning(message, data);
  }

  /**
   * Logs an error message.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   *
   * @see {@link RLog.e | e}
   *
   * @example
   * ```log
   * [ERROR]: Hello World!
   * { data: { player: "Player1" } }
   * ```
   */
  public error(message: string, data: LogData = {}) {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Shorthand version of {@link RLog.error | error}.
   *
   * @param message - The message to log.
   * @param data - Optional data to log.
   */
  public e(message: string, data: LogData = {}) {
    this.error(message, data);
  }

  /**
   * Returns a new {@link RLog} with the provided config merged with the existing config.
   *
   * @param config - Configuration settings to apply to the new instance.
   *
   * @returns The new {@link RLog} instance
   *
   * @example
   * ```ts
   * let logger = new RLog({ minLogLevel: LogLevel.DEBUG });
   *
   * const data = { position: new Vector2(5, 10) };
   * 
   * logger.v("Hello verbose!", data);
   * logger.d("Hello debug!", data);
   * // > [DEBUG]: Hello debug!
   * // > { data: { position: { X: 5, Y: 10 } } }
   *
   * // Inherits the minLogLevel
   * logger = logger.withConfig({ serialization: { encodeRobloxTypes: false } });

   * logger.v("Hello verbose!", data);
   * logger.d("Hello debug!", data);
   * // > [DEBUG]: Hello debug!
   * // > { data: { position: "<Vector2>" } }
   * ```
   */
  public withConfig(config: PartialRLogConfig): RLog {
    return this.clone({ config: config });
  }

  /**
   * Returns a new {@link RLog} with the {@link RLogConfig.minLogLevel | minLogLevel} set
   * to the provided level.
   *
   * Messages below the minimum level will be ignored.
   * 
   * You can also set this in the {@link RLogConfig | config}, this method is provided
   * purely as a means for easier changing.
   *
   * @param minLevel - The {@link LogLevel} to allow logs for.
   *
   * @returns The new {@link RLog} instance
   *
   * @example
   * ```ts
   * let logger = new RLog();
   *
   * logger.v("Hello verbose!");
   * logger.d("Hello debug!");
   * // > [VERBOSE]: Hello verbose!
   * // > [DEBUG]: Hello debug!
   *
   * logger = logger.withMinLogLevel(LogLevel.DEBUG);

   * logger.v("Hello verbose!");
   * logger.d("Hello debug!");
   * // > [DEBUG]: Hello debug!
   * ```
   */
  public withMinLogLevel(minLevel: LogLevel): RLog {
    return this.clone({ config: { minLogLevel: minLevel } });
  }

  /**
   * Returns a new {@link RLog} with the {@link RLogConfig.tag | tag} set
   * to the provided string.
   *
   * Tags are appended to log messages when present, for easier filtering.
   *
   * Usually, they're used at the class or module level to keep track of all logs
   * facilitated by a single service or action.
   *
   * @param tag - The new tag to use.
   *
   * @returns The new {@link RLog} instance.
   *
   * @example
   * ```ts
   * let logger = new RLog();
   *
   * logger.d("Hello world!");
   * // > [DEBUG]: "Hello world!"
   *
   * logger = logger.withTag("main");
   *
   * logger.d("Hello world!");
   * // > [DEBUG]: main -> "Hello world!"
   * ```
   */
  public withTag(tag: string): RLog {
    return this.clone({ config: { tag: tag } });
  }

  /**
   * Returns a new {@link RLog} with the {@link RLog.context | context} set
   * to the provided context.
   *
   * @param context - The new context to use.
   *
   * @returns The new {@link RLog} instance.
   */
  public withLogContext(context: LogContext): RLog {
    return this.clone({ context: context });
  }
}

/**
 * Mapping to {@link RLog}
 *
 * @public
 */
export const rlog = RLog;

/**
 * Mapping to {@link RLog}
 *
 * @public
 */
export const rLog = RLog;

/**
 * Mapping to {@link RLog.default} for easier default usage.
 *
 * @public
 */
export const rLogger = RLog.default;
