/**
 * Metadata based logging framework for ROBLOX projects.
 *
 * @remarks
 * `rlog` exports the {@link RLog} class as the primary entry point.
 *
 * @packageDocumentation
 */

/// <reference types="@rbxts/compiler-types" />

/**
 * A callback that take in a {@link LogContext} and optionally returns a value.
 *
 * @see {@link withLogContext:(callback)}, {@link withLogContextAsync}
 *
 * @public
 */
export declare type ContextCallback<R = void> = (context: LogContext) => R;

/**
 * Enricher for adding a tag to a log matching the file path, if absent.
 *
 * If the entry doesn't have a tag, then this enricher will use the
 * {@link SourceMetadata.file_path | file_path} of where log occurred instead.
 *
 * @example
 * ```ts
 * const logger = new RLog({ enrichers: [fileTagEnricher] });
 * logger.i("Hello world!");
 * // > [INFO]: ReplicatedStorage.TS.main -> Hello world!
 * ```
 *
 * @public
 */
export declare function fileTagEnricher(entry: LogEntry): LogEntry;

/**
 * Type representing a callback function for converting log entries to output.
 *
 * @param entry - The log entry to convert.
 *
 * @returns A tuple of arguments to output in the entry's place
 *
 * @public
 */
export declare type FormatMethodCallback = (entry: LogEntry) => LuaTuple<unknown[]>;

/**
 * Enricher for adding a tag to a log matching the function name, if absent.
 *
 * If the entry doesn't have a tag, then this enricher will use the
 * {@link SourceMetadata.nearest_function_name | nearest_function_name} of where log occurred instead.
 *
 * @example
 * ```ts
 * const logger = new RLog({ enrichers: [functionTagEnricher] });
 *
 * function CoolFunction() {
 *  logger.i("Hello world!");
 * }
 *
 * CoolFunction();
 * // > [INFO]: CoolFunction -> Hello world!
 * ```
 *
 * @public
 */
export declare function functionTagEnricher(entry: LogEntry): LogEntry;

/**
 * Context for a collection of log entries.
 *
 * Provides a centrialized means for tracking correlation ids,
 * allowing you to create a linkage between log entries in individual
 * logic flows- enabling more streamlined debugging in high traffic or
 * asynchronous environments.
 *
 * @see {@link LogContext.start | start}, {@link RLog.ForceContextFlush | ForceContextFlush}
 *
 * @public
 */
export declare class LogContext {
    readonly correlation_id: string;
    readonly config: RLogConfig;
    private _dead;
    /**
     * A context is considered dead after {@link LogContext.stop | stop} has been called.
     *
     * A dead context should not be used anymore, and can not be re-started.
     *
     * @returns boolean indicating whether this context is usable or not.
     */
    IsDead(): boolean;
    /**
     * Constructor for manually creating a {@link LogContext}.
     *
     * @param correlation_id - Tracking identifier attached to all logs that use this context.
     * @param config - Common configuration shared between all consumers of this context.
     *
     * @see {@link LogContext.start | start}
     */
    constructor(correlation_id: string, config: RLogConfig);
    /**
     * Creates a new {@link LogContext} instance that inherits this context.
     *
     * The correlation id will be the same, but the config will be merged with
     * the provided config.
     *
     * Can be used to create slightly different versions of the same context.
     *
     * @param config - Config to merge with this context.
     *
     * @returns A new {@link LogContext} instance.
     *
     * @throws If the context is dead (ie; if {@link LogContext.stop | stop} was called already)
     *
     * @example
     * ```ts
     * const mainContext = LogContext.start({ minLogLevel: LogLevel.DEBUG });
     *
     * // inherits the `minLogLevel`
     * const secondaryContext = mainContext.withConfig({ contextBypass: true });
     * ```
     */
    withConfig(config: PartialRLogConfig): LogContext;
    /**
     * Creates a new {@link RLog} instance that inherits this context.
     *
     * All {@link RLog} instances that use the same {@link LogContext} will
     * have the same `correlation_id` attached to their messages.
     *
     * @param config - Optional config to merge with this context and the new instance.
     *
     * @returns A new {@link RLog} instance.
     *
     * @see {@link LogContext.stop | stop}
     *
     * @throws If the context is dead (ie; if {@link LogContext.stop | stop} was called already)
     *
     * @example
     * ```ts
     * const context = LogContext.start();
     *
     * const logger = context.use({ tag: "Main" });
     *
     * logger.i("Hello world!");
     *
     * context.stop();
     * // > [INFO]: Main -> Hello world!
     * // > { correlation_id: "sITjsHD89b" }
     * ```
     */
    use(config?: PartialRLogConfig): RLog;
    /**
     * Marks this context as dead, preventing any further usage.
     *
     * Will make calls to the context manager to ensure there are
     * no memory leaks.
     *
     * Can safely be called multiple times, calling stop on an already
     * dead instance will _not_ throw an error.
     *
     * @see {@link RLogConfig.contextBypass | contextBypass}, {@link RLogConfig.suspendContext | suspendContext}
     *
     * @example
     * ```ts
     * function GiveMoney(context: LogContext, player: Player, money: number) {
     *   // ...
     * }
     *
     * remotes.giveMoney.connect((player: Player, money: number) => {
     *   const context = LogContext.start();
     *
     *   GiveMoney(context, player, money);
     *
     *   context.stop();
     * });
     * ```
     */
    stop(): void;
    /**
     * Creates a new {@link LogContext}.
     *
     * The context can be used to create {@link RLog} instances by calling
     * {@link LogContext.use | use}.
     *
     * When you're done with the context, make sure to call {@link LogContext.stop | stop}
     * to prevent memory leaks.
     *
     * @param config - Optional config to use for the context.
     * {@link RLog} instances that use this context will merge their configs
     * with the config of the context.
     *
     * @returns A new {@link LogContext} instance.
     *
     * @see {@link withLogContext}, {@link RLogConfig.correlationGenerator | correlationGenerator}
     *
     * @example
     * ```ts
     * function GiveMoney(context: LogContext, player: Player, money: number) {
     *   // ...
     * }
     *
     * remotes.giveMoney.connect((player: Player, money: number) => {
     *   const context = LogContext.start();
     *
     *   GiveMoney(context, player, money);
     *
     *   context.stop();
     * });
     * ```
     */
    static start(config?: PartialRLogConfig): LogContext;
}

/**
 * Type representing the additional data associated with a log entry.
 *
 * @public
 */
export declare type LogData = Record<string, unknown>;

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
export declare type LogEnricherCallback = (entry: LogEntry) => LogEntry;

/**
 * A single logging event.
 *
 * Each message has its own instance of this, with relevant data
 * attached.
 *
 * @public
 */
export declare type LogEntry = {
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
 * Enum representing the various log levels, or "importance" of a {@link LogEntry}.
 *
 * @public
 */
export declare enum LogLevel {
    /**
     * The lowest level of logging.
     *
     * Verbose messages are those that are not usually useful
     * unless you need to see deep step-by-step processes in your
     * application.
     */
    VERBOSE = 0,
    /**
     * The second lowest level of logging.
     *
     * Generally used for messages that you don't necessarily
     * need to see at runtime, but they're useful when you need
     * to find out why something is happening.
     */
    DEBUG = 1,
    /**
     * The baseline level of logging.
     *
     * Useful for messages that signify an event or interaction.
     * Usually occur only once or twice in a control flow, and are used
     * less for debugging, and more for seeing what's going on in your application.
     */
    INFO = 2,
    /**
     * Not as bad as an {@link LogLevel.ERROR | ERROR}, but something that you should be looked at.
     *
     * Useful for situations where something isn't necessarily breaking, but it's behaving
     * in a way that isn't desired.
     */
    WARNING = 3,
    /**
     * The highest level of logging.
     *
     * Used to indicate issues or exceptions that broke the application, and need to be fixed.
     */
    ERROR = 4
}

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
export declare type LogSinkCallback = (entry: LogEntry) => boolean | void;

/**
 * Type representing a callback function for sending a log to the roblox console.
 *
 * @param entry - The entry from where this log came from.
 * @param messages - A tuple of arguments to output in the entry's place.
 *
 * @public
 */
export declare type OutputMethodCallback = (entry: LogEntry, messages: LuaTuple<unknown[]>) => void;

/**
 * Version of {@link RLogConfig} that allows all data to be absent.
 *
 * @public
 */
export declare type PartialRLogConfig = Partial<ExcludeMembers<RLogConfig, SerializationConfig>> & {
    readonly serialization?: Partial<SerializationConfig>;
};

/**
 * Class for Server-Side Roblox Logging.
 *
 * You can also use {@link rlog} or {@link rLog}- for style purposes.
 *
 * @public
 */
export declare class RLog {
    /**
     * @internal
     * @readonly
     */
    _config: RLogConfig;
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
    readonly context: LogContext | undefined;
    /**
     * The default or "global" {@link RLog} instance.
     *
     * All loggers inherit from this, so it's a convenient way for
     * attaching global sinks, enrichers, or configuration.
     */
    static readonly default: RLog;
    /**
     * Constructs a new {@link RLog} instance.
     *
     * @param config - Configuration settings to use for this logger instance.
     * @param context - The {@link LogContext} to use as a base for this instance.
     * @param inheritDefault - Whether to merge configs with the {@link RLog.default | default instance}. Defaults to true.
     */
    constructor(config?: PartialRLogConfig, context?: LogContext, inheritDefault?: boolean);
    /**
     * Constructs a new {@link RLog} instance.
     *
     * Uses the provided table in place of the argument names.
     */
    constructor({ config, context, inheritDefault }: RLogConstructorParameters);
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
    static SetDefaultConfig(config: PartialRLogConfig): void;
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
    static UpdateDefaultConfig(config: PartialRLogConfig): void;
    /**
     * Resets the config for the {@link RLog.default | default} instance to the original settings.
     *
     * Essentially would be the same as if you never touched the default config.
     *
     * @see {@link RLog.UpdateDefaultConfig | UpdateDefaultConfig}, {@link RLog.ResetDefaultConfig | SetDefaultConfig}
     */
    static ResetDefaultConfig(): void;
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
    static ForceContextFlush(): void;
    /**
     * Creates a new {@link RLog} instance with all the same settings and properties.
     *
     * Everything is deep copied, so any mutations to the original will safely not replicate.
     *
     * @returns A duplicate of this {@link RLog} instance.
     */
    clone(): RLog;
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
    clone({ config, context }: RLogConstructorParameters): RLog;
    /**
     * Logs a message with a specified log level.
     *
     * @param level - The severity of the log.
     * @param message - The core message of the log.
     * @param data - Optional data to log. Will be encoded according to this logger's {@link RLogConfig | config}.
     *
     * @see {@link RLog.verbose | verbose}, {@link RLog.debug | debug}, {@link RLog.info | info}, {@link RLog.warning | warning}, {@link RLog.error | error}
     */
    log(level: LogLevel, message: string, data?: LogData): void;
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
    verbose(message: string, data?: LogData): void;
    /**
     * Shorthand version of {@link RLog.verbose | verbose}.
     *
     * @param message - The message to log.
     * @param data - Optional data to log.
     */
    v(message: string, data?: LogData): void;
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
    debug(message: string, data?: LogData): void;
    /**
     * Shorthand version of {@link RLog.debug | debug}.
     *
     * @param message - The message to log.
     * @param data - Optional data to log.
     */
    d(message: string, data?: LogData): void;
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
    info(message: string, data?: LogData): void;
    /**
     * Shorthand version of {@link RLog.info | info}.
     *
     * @param message - The message to log.
     * @param data - Optional data to log.
     */
    i(message: string, data?: LogData): void;
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
    warning(message: string, data?: LogData): void;
    /**
     * Shorthand version of {@link RLog.warning | warning}.
     *
     * @param message - The message to log.
     * @param data - Optional data to log.
     */
    warn(message: string, data?: LogData): void;
    /**
     * Shorthand version of {@link RLog.warning | warning}.
     *
     * @param message - The message to log.
     * @param data - Optional data to log.
     */
    w(message: string, data?: LogData): void;
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
    error(message: string, data?: LogData): void;
    /**
     * Shorthand version of {@link RLog.error | error}.
     *
     * @param message - The message to log.
     * @param data - Optional data to log.
     */
    e(message: string, data?: LogData): void;
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
    withConfig(config: PartialRLogConfig): RLog;
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
    withMinLogLevel(minLevel: LogLevel): RLog;
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
    withTag(tag: string): RLog;
    /**
     * Returns a new {@link RLog} with the {@link RLog.context | context} set
     * to the provided context.
     *
     * @param context - The new context to use.
     *
     * @returns The new {@link RLog} instance.
     */
    withLogContext(context: LogContext): RLog;
}

/**
 * Mapping to {@link RLog}
 *
 * @public
 */
export declare const rLog: typeof RLog;

/**
 * Mapping to {@link RLog}
 *
 * @public
 */
export declare const rlog: typeof RLog;

/**
 * Configuration settings for {@link RLog}.
 *
 * @public
 */
export declare type RLogConfig = {
    /**
     * Sets the minimum {@link LogLevel} for data to be logged.
     *
     * Messages below the minimum level will be ignored.
     *
     * @defaultValue If in studio {@link LogLevel.VERBOSE | VERBOSE}, else {@link LogLevel.WARNING | WARNING}
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
    readonly minLogLevel: LogLevel;
    /** Settings to use when encoding {@link LogEntry.data | data} in logs. */
    readonly serialization: SerializationConfig;
    /**
     * Optional function to generate correlation IDs.
     *
     * By default, Correlation IDs are generated via a combination of
     * {@link https://create.roblox.com/docs/en-us/reference/engine/classes/HttpService#GenerateGUID | HttpService.GenerateGUID }
     * and the current time- to avoid conflicts.
     *
     * If you specify your own function, it will be called anytime a
     * new Correlation ID is requested.
     *
     * Especially useful if you want to create Correlation IDs to match
     * ids in your external database.
     *
     * @example
     * ```ts
     * function generateCorrelationID(): string {
     *   return "1";
     * }
     *
     * const config = { correlationGenerator: generateCorrelationID };
     *
     * withLogContext(config, (context) => {
     *   const logger = context.use();
     *   logger.i("Player created", { player: player });
     * });
     * // > [INFO]: Player created
     * // > { "correlation_id": "1", "data": { "player": 1338 } }
     * ```
     */
    readonly correlationGenerator?: () => string;
    /**
     * Optional string to prefix to all logs.
     *
     * Will be followed by a `->` between the log message and the log level.
     *
     * **Note:** This setting is ignored when merging configs.
     *
     * @example
     * ```ts
     * const logger = new RLog({ tag: "Main" });
     *
     * logger.i("Hello world!");
     * // > [INFO]: Main -> Hello world!
     * ```
     */
    readonly tag?: string;
    /**
     * An array of {@link LogSinkCallback} to call whenever sending a message.
     */
    readonly sinks?: LogSinkCallback[];
    /**
     * An array of {@link LogEnricherCallback} to call whenever sending a message.
     */
    readonly enrichers?: LogEnricherCallback[];
    /**
     * Allows logs that have context to bypass {@link RLogConfig.minLogLevel | minLogLevel} under certain
     * circumstances.
     *
     * With this setting enabled, even if the {@link RLogConfig.minLogLevel | minLogLevel} is set
     * to filter out logs below {@link LogLevel.WARNING | WARNING}, if one of the logs in the context
     * is that of {@link LogLevel.WARNING | WARNING} or above, then _all_ of the logs in the context
     * will be sent through.
     *
     * Allows you to set a high {@link RLogConfig.minLogLevel | minLogLevel} without sacrificing
     * a proper log trace whenever something bad happens.
     *
     * @defaultValue `false`
     *
     * @see {@link RLogConfig.suspendContext | suspendContext}
     *
     * @example
     * ```ts
     * const config = { minLogLevel: LogLevel.DEBUG, contextBypass: true }
     *
     * withLogContext(config, (context) => {
     *   const logger = context.use();
     *
     *   logger.i("Hello world!");
     *   logger.w("Oh no!");
     *   logger.i("Goodbye world!");
     * });
     * // > [WARNING]: Oh no!
     * // > { correlation_id: "QQLRSFsPfoTfgD7b" }
     * //
     * // > [INFO]: Hello world!
     * // > { correlation_id: "QQLRSFsPfoTfgD7b" }
     * //
     * // > [INFO]: Goodbye world!
     * // > { correlation_id: "QQLRSFsPfoTfgD7b" }
     * ```
     */
    readonly contextBypass: boolean;
    /**
     * Prevents logs from propogating until the context is killed.
     *
     * With this setting enabled, logs with context will not be sent until the context is stopped.
     *
     * All of the messages will be sent at once when the context is stopped.
     *
     * Can be used in tangent with {@link RLogConfig.contextBypass | contextBypass} to
     * retain log order.
     *
     * @defaultValue `false`
     *
     * @example
     * ```ts
     * const config = { minLogLevel: LogLevel.DEBUG, suspendContext: true }
     *
     * withLogContext(config, (context) => {
     *   const logger = context.use();
     *
     *   logger.i("Hello world!");
     *   logger.w("Oh no!");
     *   logger.i("Goodbye world!");
     * });
     * // > [INFO]: Hello world!
     * // > { correlation_id: "QQLRSFsPfoTfgD7b" }
     * //
     * // > [WARNING]: Oh no!
     * // > { correlation_id: "QQLRSFsPfoTfgD7b" }
     * //
     * // > [INFO]: Goodbye world!
     * // > { correlation_id: "QQLRSFsPfoTfgD7b" }
     * ```
     */
    readonly suspendContext: boolean;
};

/**
 * Table version of the constructor parameters for {@link RLog}.
 *
 * @public
 */
export declare type RLogConstructorParameters = {
    config?: PartialRLogConfig;
    context?: LogContext;
    inheritDefault?: boolean;
};

/**
 * Mapping to {@link RLog.default} for easier default usage.
 *
 * @public
 */
export declare const rLogger: RLog;

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
 *
 * @public
 */
export declare function robloxConsoleSink({ formatMethod, outputMethod, minLogLevel, disable }?: RobloxConsoleSinkConfig): (entry: LogEntry) => void;

/**
 * Configuration options for {@link robloxConsoleSink}.
 *
 * @public
 */
export declare type RobloxConsoleSinkConfig = {
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
 * Configuration settings for serialization.
 *
 * @see {@link RLogConfig}
 *
 * @public
 */
export declare type SerializationConfig = {
    /**
     * Whether to encode Roblox-specific types.
     *
     * When this setting is disabled, all roblox-specific types will
     * instead just be represented as `"<TYPE_NAME>"`.
     *
     * @defaultValue `true`
     *
     * @example
     * ```ts
     * logger.i("Player died", { player: player, location: player.Position });
     * // > [INFO]: Player died
     * // > { "data": { "player": 1338, "location": "<Vector3>" } }
     * ```
     */
    readonly encodeRobloxTypes: boolean;
    /**
     * Whether to encode Roblox-specific types.
     *
     * When this setting is disabled, all function types will
     * be represented as `"<Function>"`. Otherwise, they'll be excluded
     * from the outputted JSON.
     *
     * @defaultValue `false`
     *
     * @example
     * ```ts
     * function createPlayer(name: string) {
     *   return {
     *     name: name,
     *     eatFood: () => {
     *       // ...
     *     }
     *   }
     * }
     *
     * const player = createPlayer("daymon");
     *
     * let logger = new RLog({ serialization: { encodeFunctions: true } });
     *
     * logger.i("Player created", { player: player });
     * // > [INFO]: Player created
     * // > { "data": { "player": { "name": "daymon", "eatFood": "<Function>" } } }
     *
     * logger = new RLog({ serialization: { encodeFunctions: false } });
     *
     * logger.i("Player created", { player: player });
     * // > [INFO]: Player created
     * // > { "data": { "player": { "name": "daymon" } } }
     * ```
     */
    readonly encodeFunctions: boolean;
    /**
     * Whether to perform deep encoding on tables.
     *
     * When disabled, tables will not be recursively encoded, which may cause you
     * to miss out on certain data types being properly translated (eg; roblox data types).
     *
     * This will occur even if you have {@link SerializationConfig.encodeRobloxTypes | encodeRobloxTypes}
     * enabled.
     *
     * But if you have deeply nested data types, or are wanting to save on performance,
     * this may be desirable.
     *
     * @defaultValue `true`
     *
     * @example
     * ```
     * const event = {
     *   source: {
     *     position: new Vector2(1, 1),
     *     distance: 100
     *   },
     *   target: new Vector2(2, 2),
     * };
     *
     * let logger = new RLog({ serialization: { deepEncodeTables: true } });
     * logger.i("Gun was fired", event);
     * // > [INFO]: Gun was fired
     * // > { "data": { "source": { "position": { "X": 1, "Y": 1}, "distance": 100 }, "target": { "X": 2, "Y": 2} } }
     *
     * logger = new RLog({ serialization: { deepEncodeTables: false } });
     * logger.i("Gun was fired", event);
     * // > [INFO]: Gun was fired
     * // > { "data": { "source": { "position": null, "distance": 100 }, "target": { "X": 2, "Y": 2} } }
     * ```
     */
    readonly deepEncodeTables: boolean;
    /**
     * The method name to use for custom serialization.
     *
     * When encoding an object, the encoder will first check if the object has
     * a method with this name. If it does, it will call that method instead of
     * trying to manually encode it.
     *
     * @defaultValue `__tostring`
     *
     * @example
     * ```ts
     * class PlayerClass {
     *   constructor(public name: string) {};
     *
     *   public encode() {
     *    return { name: this.name };
     *   }
     * }
     *
     * const player = new PlayerClass("daymon");
     *
     * let logger = new RLog();
     *
     * logger.i("Player created", { player: player });
     * // > [INFO]: Player created
     * // > { "data": { "player": "PlayerClass" } }
     *
     * logger = new RLog({ serialization: { encodeMethod: "encode" } });
     *
     * logger.i("Player created", { player: player });
     * // > [INFO]: Player created
     * // > { "data": { "player": { "name": "daymon" } } }
     * ```
     */
    readonly encodeMethod: string;
};

/**
 * Metadata used in identifying _where_ in the source code a log occurred.
 *
 * @public
 */
export declare type SourceMetadata = {
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

/**
 * Attaches {@link LogEntry.source_metadata | source_metadata } to the output of a log entry.
 *
 * The metadata is attached under the `source_metadata` key in {@link LogEntry.encoded_data | encoded_data}.
 *
 * If a value is `undefined`, it will not be populated.
 *
 * @public
 *
 * @example
 * ```log
 * [INFO]: Actions -> Hello world!
 * {
 *   data: {
 *     source_metadata: {
 *       function_name: "doAction",
 *       nearest_function_name: "doAction",
 *       file_path: "ReplicatedStorage.TS.actions",
 *       line_number: 5
 *     }
 *   }
 * }
 * ```
 */
export declare function sourceMetadataEnricher(entry: LogEntry): LogEntry;

/**
 * Wraps around a callback, automatically creating and managing the lifecycle
 * for a {@link LogContext}.
 *
 * The callback will be invoked immediately, and within the same thread.
 *
 * Any errors thrown within the callback will be re-thrown after calling
 * {@link LogContext.stop | stop} on the created context to avoid memory leaks.
 *
 * Any value returned from the callback will also be propagated appropriately.
 *
 * @param config - Optional config to create the context with.
 * @param callback - {@link ContextCallback} scope to run and provide the context for.
 *
 * @see {@link withLogContextAsync}
 *
 * @example
 * ```ts
 * remotes.buyPet.connect((player: Player, pet: PetId) => {
 *   // automatically starts and stops the context
 *   withLogContext({ minLogLevel: LogLevel.DEBUG }, (context) => {
 *     buyPet(context, player.UserId, pet);
 *   });
 * });
 * ```
 *
 * @public
 */
export declare function withLogContext<R = void>(config: PartialRLogConfig, callback: ContextCallback<R>): R;

/**
 * Wraps around a callback, automatically creating and managing the lifecycle
 * for a {@link LogContext}.
 *
 * The callback will be invoked immediately, and within the same thread.
 *
 * Any errors thrown within the callback will be re-thrown after calling
 * {@link LogContext.stop | stop} on the created context to avoid memory leaks.
 *
 * Any value returned from the callback will also be propagated appropriately.
 *
 * @param callback - {@link ContextCallback} scope to run and provide the context for.
 *
 * @see {@link withLogContextAsync}
 *
 * @example
 * ```ts
 * remotes.buyPet.connect((player: Player, pet: PetId) => {
 *   // automatically starts and stops the context
 *   withLogContext((context) => {
 *     buyPet(context, player.UserId, pet);
 *   });
 * });
 * ```
 *
 * @public
 */
export declare function withLogContext<R = void>(callback: ContextCallback<R>): R;

/**
 * Wraps around an async callback, automatically creating and managing the lifecycle
 * for a {@link LogContext}.
 *
 * Will call {@link LogContext.stop | stop} on the created context when the executed
 * scope is finished- regardless if the promise was cancelled or threw an error.
 *
 * Any value returned from the callback will also be propagated appropriately.
 *
 * @param config - Optional config to create the context with.
 * @param callback - {@link ContextCallback} scope to run and provide the context for.
 *
 * @see {@link withLogContext}
 *
 * @example
 * ```ts
 * remotes.buyPet.onRequest((player: Player, pet: PetId) =>
 *   // automatically starts and stops the context
 *   withLogContextAsync({ minLogLevel: LogLevel.DEBUG }, async (context) => {
 *     return buyPet(context, player.UserId, pet);
 *   }),
 * );
 * ```
 *
 * @public
 */
export declare function withLogContextAsync<R = void>(config: PartialRLogConfig, callback: ContextCallback<Promise<R>>): Promise<R>;

/**
 * Wraps around an async callback, automatically creating and managing the lifecycle
 * for a {@link LogContext}.
 *
 * Will call {@link LogContext.stop | stop} on the created context when the executed
 * scope is finished- regardless if the promise was cancelled or threw an error.
 *
 * Any value returned from the callback will also be propagated appropriately.
 *
 * @param callback - {@link ContextCallback} scope to run and provide the context for.
 *
 * @see {@link withLogContext}
 *
 * @example
 * ```ts
 * remotes.buyPet.onRequest((player: Player, pet: PetId) =>
 *   // automatically starts and stops the context
 *   withLogContextAsync(async (context) => {
 *     return buyPet(context, player.UserId, pet);
 *   }),
 * );
 * ```
 *
 * @public
 */
export declare function withLogContextAsync<R = void>(callback: ContextCallback<Promise<R>>): Promise<R>;

export { }
