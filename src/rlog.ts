import { HttpService } from "@rbxts/services";
import { enrich, LogData, LogEntry, LogLevel, sink, SourceMetadata } from "./common";
import { mergeConfigs, PartialRLogConfig, RLogConfig } from "./configuration";
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
  return "config" in value || "context" in value;
}

// TODO(): needs testing
function extractSourceMetadata(): SourceMetadata {
  const metadata = {
    function_name: undefined,
    nearest_function_name: undefined,
    file_path: undefined,
    line_number: undefined,
  } as Writable<Partial<SourceMetadata>>;

  let stack_level = 2;
  let file;
  do {
    stack_level += 1;

    const [file, line, func] = debug.info(stack_level, "sln");
    if (file === FILE_NAME) continue;
    if (metadata.file_path === undefined) {
      metadata.file_path = file;
      metadata.function_name = func;
      metadata.line_number = line;
    }
    if (metadata.nearest_function_name === undefined) {
      metadata.nearest_function_name = func;
    } else {
      break;
    }
  } while (file !== undefined);

  return metadata as SourceMetadata;
}

function GenerateCorrelationID(config: RLogConfig) {
  if (config.correlationGenerator) return config.correlationGenerator();

  return `${DateTime.now().UnixTimestamp}_${HttpService.GenerateGUID(false)}`;
}

// TODO(): document
export type ContextCallback<R = void> = (context: LogContext) => R;

function isContextCallback(value: unknown): value is ContextCallback {
  return typeIs(value, "function");
}

// TODO(): document
export function withLogContext<R = void>(callback: ContextCallback<R>): R;
// TODO(): document. don't forget about @inheritDoc
export function withLogContext<R = void>(config: PartialRLogConfig, callback: ContextCallback<R>): R;

// will run the callback right away
// will catch errors so we can close context, but will rethrow them after
// TODO(): document
export function withLogContext<R = void>(arg1: PartialRLogConfig | ContextCallback<R>, arg2?: ContextCallback<R>): R {
  if (isContextCallback(arg1)) {
    const createdContext = LogContext.start();
    try {
      return arg1(createdContext);
    } finally {
      createdContext.stop();
    }
  } else if (isContextCallback(arg2)) {
    const createdContext = LogContext.start(arg1);

    try {
      return arg2(createdContext);
    } finally {
      createdContext.stop();
    }
  } else {
    error(`withLogContext called with invalid arguments:\narg1:"${arg1}"\narg2:"${arg2}"`);
  }
}

// TODO(): document
export async function withLogContextAsync<R = void>(callback: ContextCallback<Promise<R>>): Promise<R>;
// TODO(): document. don't forget about @inheritDoc
export async function withLogContextAsync<R = void>(
  config: PartialRLogConfig,
  callback: ContextCallback<Promise<R>>
): Promise<R>;

// will run the callback right away
// will catch errors so we can close context, but will rethrow them after
// TODO(): document
export async function withLogContextAsync<R = void>(
  arg1: PartialRLogConfig | ContextCallback<Promise<R>>,
  arg2?: ContextCallback<Promise<R>>
): Promise<R> {
  if (isContextCallback(arg1)) {
    const createdContext = LogContext.start();

    return arg1(createdContext).finally(() => {
      createdContext.stop();
    }) as Promise<R>;
  } else if (isContextCallback(arg2)) {
    const createdContext = LogContext.start(arg1);

    return arg2(createdContext).finally(() => {
      createdContext.stop();
    }) as Promise<R>;
  } else {
    return Promise.reject(
      `withLogContext called with invalid arguments:\narg1:"${arg1}"\narg2:"${arg2}"`
    ) as Promise<R>;
  }
}

// TODO(): document
export class LogContext {
  private _dead: boolean = false;

  public IsDead() {
    return this._dead;
  }

  constructor(
    public readonly correlation_id: string,
    public readonly config: RLogConfig
  ) {}

  public withConfig(config: PartialRLogConfig) {
    if (this._dead) error("Attempted to use a dead LogContext via `LogContext.withConfig`");

    return new LogContext(this.correlation_id, mergeConfigs(this.config, config));
  }

  public use(config?: PartialRLogConfig) {
    if (this._dead) error("Attempted to use a dead LogContext via `LogContext.use`");

    return new rLog(config, this);
  }

  public stop() {
    this._dead = true;
    LogContextManager.flush(this);
  }

  public static start(config?: PartialRLogConfig): LogContext {
    const finalConfig = mergeConfigs(config);
    const id = GenerateCorrelationID(finalConfig);

    return new LogContext(id, finalConfig);
  }
}

/**
 * Class for faciliating Roblox Logging.
 *
 * You can also use {@link rlog} or {@link rLog}- for style purposes.
 *
 * @public
 */
export class RLog {
  /**
   * @internal
   */
  public _config: RLogConfig;

  /**
   * TODO(): document
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
   * Uses the provided table in place of the argument names.
   */
  public constructor({ config, context, inheritDefault }: RLogConstructorParameters);

  /**
   * Constructs a new {@link RLog} instance.
   *
   * @param config - Configuration settings to use for this logger instance.
   *
   */
  public constructor(config?: PartialRLogConfig, context?: LogContext, inheritDefault?: boolean);

  /**
   * Constructs a new {@link RLog} instance.
   *
   * See the other constructors for more details.
   */
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
      this.context = new LogContext(context.correlation_id, this._config);
    }
  }

  /**
   * Sets the config for the {@link RLog.default | default} instance.
   *
   * Since all {@link RLog} instances inherit their config from the default instance,
   * this is a convenient way to provide default configuration settings.
   *
   * _Note that this will **not** change the config for instances already created._
   *
   * @param config - The {@link RLogConfig} to use.
   *
   * @example
   * ```ts
   * RLog.SetDefaultConfig({ { serialization: { encodeFunctions: true } } });
   *
   * // Inherits the `encodeFunctions` setting automatically
   * const logger = new RLog({ serialization: { encodeRobloxTypes: false } });
   *
   * logger.i("Player died", { player: player, location: player.Position, revive: () => {} });
   * // > [INFO]: Player died
   * // > { "data": { "player": 1338, "location": "<Vector3>", "revive": "<Function>" } }
   * ```
   */
  public static SetDefaultConfig(config: PartialRLogConfig) {
    this.default._config = mergeConfigs(config);
  }

  public static UpdateDefaultConfig(config: PartialRLogConfig) {
    this.default._config = mergeConfigs(this.default._config, config);
  }

  public static ResetDefaultConfig() {
    this.default._config = mergeConfigs({ sinks: [robloxConsoleSink()] });
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
   * @param level - The log level.
   * @param message - The log message.
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
   * Returns a new {@link RLog} with the config merged with the existing config.
   *
   * You can use this to toggle certain features on {@link RLog.child | child} instances, or
   * conditionally apply certain configurations. 
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
   * Returns a new {@link RLog} with the minLogLevel set to `minLogLevel`.
   *
   * Messages below the minimum level will be ignored.
   * 
   * You can also set this in the {@link RLogConfig | config}, this method is purely
   * provided as a means for easier changing.
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
   * Returns a new {@link RLog} with the tag set to `tag`.
   *
   * Tags are appended to log messages when present, for easier filtering.
   *
   * Usually, they're used at the class level to keep track of all logs
   * facilitated by a single class
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

  // TODO(): document
  public withContext(context: LogContext): RLog {
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
 * TODO(): Update docs and use places to use this instead
 *
 * @public
 */
export const rLogger = RLog.default;
