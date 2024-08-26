import { HttpService } from "@rbxts/services";
import { mergeConfigs, PartialRLogConfig, RLogConfig } from "../configuration";
import { RLog, rLog } from "../rlog";
import { LogContextManager } from "./log-context-manager";
import type { withLogContext } from "./util";

function GenerateCorrelationID(config: RLogConfig) {
  if (config.correlationGenerator) return config.correlationGenerator();

  return `${DateTime.now().UnixTimestamp}_${HttpService.GenerateGUID(false)}`;
}

/**
 * Context for a collection of log entries.
 *
 * @remarks
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
export class LogContext {
  private _dead: boolean = false;

  /**
   * A context is considered dead after {@link LogContext.stop | stop} has been called.
   *
   * @remarks
   *
   * A dead context should not be used anymore, and can not be re-started.
   *
   * @returns boolean indicating whether this context is usable or not.
   */
  public IsDead() {
    return this._dead;
  }

  /**
   * Constructor for manually creating a {@link LogContext}.
   *
   * @param correlation_id - Tracking identifier attached to all logs that use this context.
   * @param config - Common configuration shared between all consumers of this context.
   *
   * @see {@link LogContext.start | start}
   */
  constructor(
    public readonly correlation_id: string,
    public readonly config: RLogConfig
  ) {}

  /**
   * Creates a new {@link LogContext} instance that inherits this context.
   *
   * @remarks
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
  public withConfig(config: PartialRLogConfig) {
    if (this._dead) error("Attempted to use a dead LogContext via `LogContext.withConfig`");

    return new LogContext(this.correlation_id, mergeConfigs(this.config, config));
  }

  /**
   * Creates a new {@link RLog} instance that inherits this context.
   *
   * @remarks
   *
   * All {@link RLog} instances that use the same {@link LogContext} will
   * have the same `correlation_id` attached to their messages.
   *
   * @param config - Config to merge with this context and the new instance.
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
  public use(config?: PartialRLogConfig): RLog {
    if (this._dead) error("Attempted to use a dead LogContext via `LogContext.use`");

    return new rLog(config, this);
  }

  /**
   * Marks this context as dead, preventing any further usage.
   *
   * @remarks
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
  public stop() {
    this._dead = true;
    LogContextManager.flush(this);
  }

  /**
   * Creates a new {@link LogContext}.
   *
   * @remarks
   *
   * The context can be used to create {@link RLog} instances by calling
   * {@link LogContext.use | use}.
   *
   * When you're done with the context, make sure to call {@link LogContext.stop | stop}
   * to prevent memory leaks.
   *
   * @param config - Config to use for the context.
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
  public static start(config?: PartialRLogConfig): LogContext {
    const finalConfig = mergeConfigs(config);
    const id = GenerateCorrelationID(finalConfig);

    return new LogContext(id, finalConfig);
  }
}
