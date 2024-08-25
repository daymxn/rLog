import { PartialRLogConfig } from "../configuration";
import { LogContext } from "./log-context";

/**
 * A callback that take in a {@link LogContext} and optionally returns a value.
 *
 * @see {@link withLogContext}, {@link withLogContextAsync}
 *
 * @public
 */
export type ContextCallback<R = void> = (context: LogContext) => R;

function isContextCallback(value: unknown): value is ContextCallback {
  return typeIs(value, "function");
}

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
export function withLogContext<R = void>(config: PartialRLogConfig, callback: ContextCallback<R>): R;

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
export function withLogContext<R = void>(callback: ContextCallback<R>): R;

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
export async function withLogContextAsync<R = void>(
  config: PartialRLogConfig,
  callback: ContextCallback<Promise<R>>
): Promise<R>;

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
export async function withLogContextAsync<R = void>(callback: ContextCallback<Promise<R>>): Promise<R>;

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
