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
 * Enum representing the types of encoding strategies.
 *
 * @public
 */
export declare enum EncodingType {
  /**
   * Deep encoding strategy that processes elements thoroughly.
   *
   * More specifically, this will ensure all data is properly encoded
   * and accounted for; inspecting the individual type of each property
   * in a provided object.
   *
   * @see {@link EncodingType.FAST}
   */
  DEEP = 0,
  /**
   * Fast encoding strategy that focuses on speed.
   *
   * More specifically, this will just try to encode all data to a
   * JSON string or using `tostring` if encoding to a JSON string fails.
   *
   * So nested types (or roblox datatypes) will not be properly encoded.
   *
   * Useful if you're not logging any complex data, and want to avoid
   * extra runtime overhead.
   *
   * @see {@link EncodingType.DEEP}
   */
  FAST = 1,
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
 * edit its {@link LogEntry.metadata | metadata}, or just return it if you don't need to
 * do anything.
 *
 * To learn more about enrichers, and how they work, see {@link RLog.withEnricher | withEnricher}.
 *
 * @param entry - The log entry to enrich.
 * @param config - The configuration used for logging.
 *
 * @returns The enriched log entry.
 *
 * @public
 */
export declare type LogEnricherCallback = (entry: LogEntry, config: RLogConfig) => LogEntry;

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
  /** Metadata associated with the log entry. */
  metadata: LogMetadata;
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
  ERROR = 4,
}

/**
 * Metadata associated with a log entry.
 *
 * @public
 */
export declare type LogMetadata = {
  /** The timestamp of the log entry in epoch milliseconds. */
  timestamp: number;
  /** Optional correlation ID for tracing logs. */
  correlation_id?: string;
  /** Optional tag for categorizing the log entry. */
  tag?: string;
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
 * @param config - The configuration used for logging.
 *
 * @returns A boolean indicating whether the log was consumed, or void.
 *
 * @public
 */
export declare type LogSinkCallback = (entry: LogEntry, config: RLogConfig) => boolean | void;

/**
 * Version of {@link RLogConfig} that allows all data to be absent.
 *
 * @public
 */
export declare type PartialRLogConfig = Partial<ExcludeMembers<RLogConfig, SerializationConfig>> & {
  readonly serialization?: Partial<SerializationConfig>;
};

/**
 * Class for faciliating Roblox Logging.
 *
 * You can also use {@link rlog} or {@link rLog}- for style purposes.
 *
 * @public
 */
export declare class RLog {
  private config;
  private readonly name;
  private readonly sourceFile;
  private readonly sourceFunction;
  private readonly sinks;
  private readonly enrichers;
  private readonly correlation_id;
  /**
   * The tag of this {@link RLog} instance.
   *
   * Tags are used for filtering logs.
   *
   * See {@link RLog.withTag | withTag} for more details.
   */
  readonly tag: string | undefined;
  /**
   * The parent {@link RLog} of this instance.
   *
   * See {@link RLog.child | child} for more details on parent and child instances.
   */
  readonly parent: RLog | undefined;
  /**
   * The full path of this {@link RLog}.
   *
   * A {@link RLog} path is a concatenation of names (tags) of all
   * its parent instances, with the root being `DEFAULT`.
   *
   * In other words, its the hierarchy of the instance.
   *
   * Instances without a tag are referred to as anonymous instances, and as such
   * are labeled as `<Anonymous>`.
   *
   * @example
   * ```
   * const main = new RLog().withTag("main");
   * const secondary = main.childWithTag("secondary");
   * const anonymous = secondary.child();
   *
   * print(main.path);
   * print(secondary.path);
   * print(anonymous.path);
   * // > DEFAULT.main
   * // > DEFAULT.main.secondary
   * // > DEFAULT.main.secondary.<Anonymous>
   * ```
   */
  readonly path: string;
  /**
   * The default or "global" {@link RLog} instance.
   *
   * All loggers inherit from this, so it's a convenient way for
   * attaching global sinks or enrichers.
   */
  static readonly default: RLog;
  /**
   * Constructs a new {@link RLog} instance.
   *
   * Uses the provided table in place of the argument names.
   */
  constructor({ config, tag, parent, sinks, enrichers, correlation_id }: RLogConstructorParameters);
  /**
   * Constructs a new {@link RLog} instance.
   *
   * @param config - Configuration settings to use for this logger instance.
   * @param tag - Optional tag for this logger instance.
   * @param parent - Optional parent logger instance.
   * @param sinks - Optional array of sink callbacks.
   * @param enrichers - Optional array of enricher callbacks.
   * @param correlation_id - Optional correlation ID.
   */
  constructor(
    config?: PartialRLogConfig,
    tag?: string,
    parent?: RLog,
    sinks?: LogSinkCallback[],
    enrichers?: LogEnricherCallback[],
    correlation_id?: string
  );
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
  static SetDefaultConfig(config: PartialRLogConfig): void;
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
  clone({ config, tag, parent, sinks, enrichers, correlation_id }: RLogConstructorParameters): RLog;
  /**
   * Logs a message with a specified log level.
   *
   * @param level - The log level.
   * @param message - The log message.
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
  withConfig(config: PartialRLogConfig): RLog;
  /**
   * Returns a new {@link RLog} with the parent set to the provided `parent`.
   *
   * You can use this to switch the parents of {@link RLog.child | child} instances, or whatever
   * else you fancy.
   *
   * @param parent - The new parent to use on the new instance.
   *
   * @returns The new {@link RLog} instance
   *
   * @example
   * ```ts
   * const mainLogger = new RLog(settings, "Main");
   * const secondaryLogger = new RLog(settings, "Secondary");
   *
   * print(mainLogger.path);
   * print(secondaryLogger.path);
   * // > DEFAULT.Main
   * // > DEFAULT.Secondary
   *
   * const newSecondary = secondaryLogger.withParent(mainLogger);
   *
   * print(newSecondary.path);
   * // > DEFAULT.Main.Secondary
   * ```
   */
  withParent(parent: RLog | undefined): RLog;
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
  withMinLogLevel(minLevel: LogLevel): RLog;
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
  withTag(tag: string): RLog;
  /**
   * Returns a new {@link RLog} with the correlation_id set to `correlation_id`.
   *
   * Correlation IDs are appended to log messages when present, for further tracking
   * beyond {@link RLog.withTag | tags}. Especially useful when tracking control flows across
   * services or files.
   *
   * To learn more about Correlation IDs, see {@link RLog.child | child}.
   *
   * @param correlation_id - The new correlation_id to use.
   *
   * @returns The new {@link RLog} instance.
   *
   * @example
   * ```ts
   * const logger = new RLog().withCorrelationId("12345");
   *
   * logger.d("Hello world!");
   * // > [DEBUG]: "Hello world!"
   * // > { correlation_id: "12345" }
   * ```
   */
  withCorrelationId(correlation_id: string): RLog;
  /**
   * Creates a new {@link RLog} instance with the given `sink` added.
   *
   * Sinks are callbacks that take in a {@link LogEntry} and return a boolean
   * indicating if the entry was "consumed".
   *
   * If an entry is "consumed", that means it should not be processed any more.
   *
   * This is especially useful if you want to log your events to an external
   * server, but not the local console.
   *
   * In the case of multiple sinks, they are called in the order they are added.
   *
   * Furthermore, child sinks are called before {@link RLog.child | parent} sinks.
   *
   * _Note that the {@link LogEntry} you receive will already be enriched._
   *
   * @param sink - The sink callback.
   * @param minLevel - The minimum {@link LogLevel} for the sink. The sink will not be
   * called for logs that are below this. Defaults to {@link LogLevel.VERBOSE}.
   *
   * @returns The new {@link RLog} instance.
   *
   * @example
   * ```ts
   * function MyCustomSink(entry: LogEntry, config: RLogConfig): boolean {
   *   // ... log to external server
   *   return true; // consume the message, meaning don't pass it along
   * }
   *
   * const logger = new RLog().withSink(MyCustomSink);
   *
   * logger.v("Hello verbose"); // no output to the console, since it was consumed.
   * ```
   */
  withSink(sink: LogSinkCallback, minLevel?: LogLevel): RLog;
  /**
   * Creates a new {@link RLog} instance with all of the given `sinks` added.
   *
   * Version of {@link RLog.withSink | withSink} that allows you to provide multiple sinks at once.
   *
   * @param sinks - Array of sink callbacks.
   * @param minLevel - The minimum {@link LogLevel} for the sinks. The sinks will not be
   * called for logs that are below this. Defaults to {@link LogLevel.VERBOSE}.
   *
   * @returns The new {@link RLog} instance.
   */
  withSinks(sinks: ReadonlyArray<LogSinkCallback>, minLevel?: LogLevel): RLog;
  /**
   * Creates a new {@link RLog} instance with the given `enricher` added.
   *
   * Enrichers are callbacks that may or may not add data to
   * (or mutate directly) a {@link LogEntry}.
   *
   * In the case of multiple enrichers, they are called in the order they are added.
   *
   * Furthermore, child enrichers are called before {@link RLog.child | parent} enrichers.
   *
   * _Note that enrichers are called before sinks._
   *
   * @param enricher - The enricher callback.
   * @param minLevel - The minimum {@link LogLevel} for the enricher. The enricher will not be
   * called for logs that are below this. Defaults to {@link LogLevel.VERBOSE}.
   *
   * @returns The new {@link RLog} instance.
   *
   * @example
   * ```ts
   * function MyCustomEnricher(entry: LogEntry, config: RLogConfig): LogEntry {
   *   // attach the local player's user id if we're running in a LocalScript
   *   if(RunService.IsClient()) {
   *     entry.data["player"] = Players.LocalPlayer.UserId;
   *   }
   *
   *   // return the modified entry
   *   return entry;
   * }
   *
   * const logger = new RLog().withEnricher(MyCustomEnricher);
   *
   * logger.v("Hello verbose");
   * // > [VERBOSE]: Hello Verbose
   * // > { "data": { "player": 1333 } }
   * ```
   */
  withEnricher(enricher: LogEnricherCallback, minLevel?: LogLevel): RLog;
  /**
   * Creates a new {@link RLog} instance with all of the given `enrichers` added.
   *
   * Version of {@link RLog.withEnricher | withEnricher} that allows you to provide multiple enrichers at once.
   *
   * @param enrichers - Array of enricher callbacks.
   * @param minLevel - The minimum {@link LogLevel} for the enrichers. The enrichers will not be
   * called for logs that are below this. Defaults to {@link LogLevel.VERBOSE}.
   *
   * @returns The new {@link RLog} instance.
   */
  withEnrichers(enrichers: ReadonlyArray<LogEnricherCallback>, minLevel?: LogLevel): RLog;
  /**
   * Creates a child logger with an optional correlation ID.
   *
   * There are two components at play here: correlation ids, and child loggers.
   *
   * #### Correlation IDs
   *
   * Correlation IDs are a way to keep track of logging events that occur
   * in a single "flow" or "logical process". For example, you could create a
   * child logger for a function:
   *
   * ```ts
   * function buyPet(player: Player, pet: PetId) {
   *   const logger = rLog.default.child();
   *   logger.v("Player is purchasing a pet", { player: player, pet: pet });
   *
   *   // ... buy pet
   *
   *   logger.d("Player pet bought");
   * }
   *
   * buyPet(Players.LocalPlayer, "1");
   * // > [VERBOSE]: Player is purchasing a pet
   * // > { "correlation_id": "adss8fd_1318za_112", "data": { "player": 1333, "pet": "1" } }
   * // >
   * // > [DEBUG]: Player pet bought
   * // > { "correlation_id": "adss8fd_1318za_112" }
   * ```
   *
   * Correlation IDs can be used to track the flow of a function call. This is especially useful
   * in client to server remote calls, where you want each call to be associated with its own logs.
   *
   * This also helps in preventing the need to re-log data, as you can filter for the correlation id to
   * find the relevant data.
   *
   * #### Child Loggers
   *
   * The relationship between a parent and child logger comes with two benefits:
   *
   * ##### Shared Correlation IDs
   *
   * The child logger will (by default) inherit the correlation id of the parent.
   *
   * If you provide your own `correlation_id`, it will override the child's.
   *
   * If you don't provide one, and the parent doesn't have one, a new will be generated.
   *
   * Although, this behavior can be disabled with the {@link RLogConfig | autoGenerateCorrelation} setting.
   *
   *
   * ##### Shared Sinks and Enrichers
   *
   * A child logger has its own sinks and enrichers, meaning you can attach sinks and
   * enrichers to only the child logger without affecting the parent.
   *
   * But after a child logger has called its own enrichers (if any), it will then call
   * the parent's.
   *
   * It will repeat this process with sinks.
   *
   * ##### Usage
   *
   * Child loggers are especially useful when tracking the control flow across
   * multiple functions:
   *
   * ```
   * import { PurchaseHandler } from "./purchaseHandler";
   *
   * const Logger = new rLog(settings, "Actions");
   *
   * function buyPet(player: Player, pet: PetId) {
   *   const logger = Logger.child();
   *   logger.v("Player is purchasing a pet", { player: player, pet: pet });
   *
   *   PurchaseHandler.processPet(logger, player, pet);
   *
   *   logger.d("Player pet bought");
   * }
   *
   * buyPet(Players.LocalPlayer, "1");
   * // > [VERBOSE]: Actions -> Player is purchasing a pet
   * // > { "correlation_id": "adss8fd_1318za_112", "data": { "player": 1333, "pet": "1" } }
   * // >
   * // > [VERBOSE]: PurchaseHandler -> Processing a pet purchase
   * // > { "correlation_id": "adss8fd_1318za_112", "data": { "player": 1333, "pet": "1" } }
   * // >
   * // > [DEBUG]: PurchaseHandler -> Pet purchase processed
   * // > { "correlation_id": "adss8fd_1318za_112" }
   * // >
   * // > [DEBUG]: Actions -> Player pet bought
   * // > { "correlation_id": "adss8fd_1318za_112" }
   * ```
   *
   * @param correlation_id - Optional Correlation ID for tracking.
   * Defaults to the current `correlation_id`, if any.
   *
   * @returns The new {@link RLog} instance.
   *
   * @see {@link RLog.childWithTag | childWithTag}
   */
  child(correlation_id?: string | undefined): RLog;
  /**
   * Creates a child logger with a specific tag and optional correlation ID.
   *
   * Alternative version of {@link RLog.child | child} that allows you to specify a unique `tag` for
   * the child instance.
   *
   * _Note that child loggers do not inherit their parent's tag unless you call this method._
   *
   * @param tag - The tag for the child logger. Defaults to the calling instance's `tag`, if any.
   * @param correlation_id - Optional correlation ID. Defaults to the calling instance's `correlation_id`, if any.
   *
   * @returns The new {@link RLog} instance.
   *
   * @example
   * ```ts
   * const Logger = new rLog(settings);
   *
   * function processPurchase(parent: RLog, player: Player, pet: PetId) {
   *   const logger = parent.childWithTag("processPurchase")
   *
   *   logger.v("Processing a pet purchase", { player: player, pet: pet });
   *
   *   // ...
   *
   *   logger.d("Pet purchase processed")
   * }
   *
   * function buyPet(parent: RLog, player: Player, pet: PetId) {
   *   const logger = parent.childWithTag("buyPet");
   *
   *   logger.v("Player is purchasing a pet", { player: player, pet: pet });
   *
   *   processPurchase(logger, player, pet);
   *
   *   logger.d("Player pet bought");
   * }
   *
   * buyPet(Logger, Players.LocalPlayer, "1");
   * // > [VERBOSE]: buyPet -> Player is purchasing a pet
   * // > { "correlation_id": "adss8fd_1318za_112", "data": { "player": 1333, "pet": "1" } }
   * // >
   * // > [VERBOSE]: processPurchase -> Processing a pet purchase
   * // > { "correlation_id": "adss8fd_1318za_112", "data": { "player": 1333, "pet": "1" } }
   * // >
   * // > [DEBUG]: processPurchase -> Pet purchase processed
   * // > { "correlation_id": "adss8fd_1318za_112" }
   * // >
   * // > [DEBUG]: buyPet -> Player pet bought
   * // > { "correlation_id": "adss8fd_1318za_112" }
   * ```
   */
  childWithTag(tag?: string | undefined, correlation_id?: string | undefined): RLog;
  /**
     * Constructs the full path of this `instance`.
     *
     * @param instance - The lowest level child to search upwards from.
     * @returns The full path of the provided instance.
     *
     * @see {@link RLog.path | path}
     *

     * @internal
     */
  private static ComputePath;
  /**
     * Finds the nearest script that is not us that called this function.
     *
     * @returns The script path and the function name (if any).
     *
     * @see {@link RLogConfig.functionTags | functionTags}, {@link RLogConfig.fileTags | fileTags}
     *

     *
     * @internal
     */
  private static FindCaller;
  /**
   * @returns A table of the parameters of this instance as a {@link RLogConstructorParameters}.
   *
   * @internal
   */
  private extractConstructor;
  /**
   * Handles logging to all registered sinks.
   *
   * In a separate function so children can call parent sinks.
   *
   * @param entry - The log entry to sink.
   * @returns True if the log entry was handled ("consumed") by a sink, otherwise false.
   *
   * @internal
   */
  private sink;
  /**
   * Enriches a log entry using all registered enrichers.
   *
   * In a separate function so children can call parent enrichers.
   *
   * @param entry - The log entry to enrich.
   * @returns The enriched log entry.
   *
   * @internal
   */
  private enrich;
  /**
   * Constructs the log message string based on the log entry.
   *
   * @param entry - The log entry to format.
   * @returns The formatted log message string.
   *
   * @internal
   */
  private constructLogMessage;
  /**
   * Generates a new correlation ID if auto-generation is enabled.
   *
   * @returns The generated correlation ID, or undefined if auto-generation is disabled.
   *
   * @internal
   */
  private generateCorrelationId;
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
  /**
   * Use function names for tags when not present.
   *
   * With this setting on, when you create a logger without providing a tag,
   * the name of the function it was called from will be used instead.
   *
   * When used alongside {@link RLogConfig.fileTags | fileTags}, a file name will only be used
   * if there isn't a valid function name; which can occur in anonymous functions.
   *
   * @defaultValue `false`
   *
   * @example
   * ```ts
   * function GivePlayerMoney() {
   *  const logger = new RLog({ functionTags: true });
   *  logger.i("Money given to player");
   * }
   *
   * GivePlayerMoney();
   * // > [DEBUG] GivePlayerMoney -> Money given to player
   * ```
   */
  readonly functionTags: boolean;
  /**
   * Use file names for tags when not present.
   *
   * With this setting on, when you create a logger without providing a tag,
   * the name of the file will be used instead.
   *
   * When used alongside {@link RLogConfig.functionTags | functionTags}, a file name will only be used
   * if there isn't a valid function name; which can occur in anonymous functions.
   *
   * @defaultValue `false`
   *
   * @example
   * ```ts
   * // in file ServerScriptStorage/TS/main
   * const logger = new RLog({ fileTags: true });
   *
   * logger.i("Hello world!");
   * // > [DEBUG] ServerScriptStorage.TS.main -> Hello world!
   * ```
   */
  readonly fileTags: boolean;
  /** Settings to use when encoding {@link LogEntry.data | data} in logs. */
  readonly serialization: SerializationConfig;
  /**
   * Whether to automatically generate Correlation IDs for {@link LogMetadata | metadata}.
   *
   * By itself, disabling this doesn't do anything; as
   * {@link RLogConfig.autoGenerateCorrelation | autoGenerateCorrelation} will override it.
   *
   * For more information on how Correlation IDs work, see {@link RLog.child}.
   *
   * @defaultValue `true`
   *
   * @see {@link RLogConfig.correlationGenerator | correlationGenerator}
   *
   * @example
   * ```ts
   * const logger = new RLog({ autoGenerateCorrelation: false, autoGenerateChildCorrelation: true });
   *
   * const child = logger.child();
   * child.i("Player created", { player: player });
   * // > [INFO]: Player created
   * // > { "correlation_id": "1322412_dsra_daeqwf_daa", "data": { "player": 1338 } }
   * ```
   */
  readonly autoGenerateChildCorrelation: boolean;
  /**
   * Whether to automatically generate Correlation IDs for {@link LogMetadata | metadata}.
   *
   * When disabled, Correlation IDs will not be generated for new {@link RLog}
   * instances.
   *
   * When enabled, every new {@link RLog} instance will have its own Correlation ID generated
   * (unless you manually provide one).
   *
   * Disabling this may be desireable if you only want to have Correlation IDs for child instances
   * that you create in control flows.
   *
   * Alternatively, if you only want Correlation IDs to be present when you manually provide them,
   * you will need to also disable {@link RLogConfig.autoGenerateChildCorrelation | autoGenerateChildCorrelation}.
   *
   * @defaultValue `true`
   *
   * @see {@link RLogConfig.correlationGenerator | correlationGenerator}
   *
   * @example
   * ```ts
   * const logger = new RLog({ autoGenerateCorrelation: true });
   *
   * logger.i("Player created", { player: player });
   * // > [INFO]: Player created
   * // > { "correlation_id": "1322412_dsra_daeqwf_daa", "data": { "player": 1338 } }
   * ```
   */
  readonly autoGenerateCorrelation: boolean;
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
   * const logger = new RLog({ correlationGenerator: generateCorrelationID });
   *
   * const child = logger.child();
   * child.i("Player created", { player: player });
   * // > [INFO]: Player created
   * // > { "correlation_id": "1", "data": { "player": 1338 } }
   * ```
   */
  readonly correlationGenerator?: () => string;
};

/**
 * Table version of the constructor parameters for {@link RLog}.
 *
 * @public
 */
export declare type RLogConstructorParameters = {
  config?: PartialRLogConfig;
  tag?: string;
  parent?: RLog;
  sinks?: LogSinkCallback[];
  enrichers?: LogEnricherCallback[];
  correlation_id?: string;
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
   * The minimum {@link LogLevel} for serialization to occur.
   *
   * If a {@link LogEntry} has a level lower than this, then its
   * data will be discarded.
   *
   * Useful for when you don't want to log data in production for
   * {@link RLog.info | info} calls, but you do want to log data for {@link RLog.error | error} calls.
   *
   * @defaultValue {@link LogLevel.VERBOSE}
   *
   * @example
   * ```
   * const logger = new RLog({ serialization: { minLogLevel: LogLevel.WARNING } });
   *
   * logger.i("Player died", { player: player, location: player.Position });
   * logger.e("Player error", { player: player });
   * // > [INFO]: Player died
   * // >
   * // > [ERROR]: Player left
   * // > { "data": { "player": 1338 } }
   * ```
   */
  readonly minLogLevel: LogLevel;
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
   * class PlayerClass {
   *   constructor(public name: string) {};
   *   public eatFood() {
   *    // ...
   *   }
   * }
   *
   * const player = new PlayerClass("daymon");
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
   * When disabled, tables will not be recursively encoded. Which may cause you
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
   * The encoding strategy to use.
   *
   * The encoding strategy specifies how data is encoded.
   *
   * To learn the specifics about each type, see {@link EncodingType}.
   *
   * Having an `encodeType` of {@link EncodingType.FAST | FAST} functions very similiarly to
   * having {@link SerializationConfig.deepEncodeTables | deepEncodeTables} disabled. The difference
   * is that with {@link EncodingType.DEEP | DEEP}, even with {@link SerializationConfig.deepEncodeTables | deepEncodeTables}
   * disabled, it will still try to call {@link SerializationConfig.encodeMethod | encodeMethod} or `tostring`.
   * before giving up.
   *
   * You also won't get roblox data types encoded at the first level with {@link EncodingType.FAST | FAST}.
   *
   * @defaultValue {@link EncodingType.DEEP | DEEP}
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
   * let logger = new RLog({ serialization: { encodeType: EncodingType.DEEP } });
   * logger.i("Gun was fired", event);
   * // > [INFO]: Gun was fired
   * // > { "data": { "source": { "position": { "X": 1, "Y": 1}, "distance": 100 }, "target": { "X": 2, "Y": 2} } }
   *
   * logger = new RLog({ serialization: { encodeType: EncodingType.FAST } });
   * logger.i("Gun was fired", event);
   * // > [INFO]: Gun was fired
   * // > { "data": { "source": { "position": null, "distance": 100 }, "target": null } }
   * ```
   */
  readonly encodeType: EncodingType;
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

export {};
