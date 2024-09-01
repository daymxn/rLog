/**
 * @license
 * Copyright 2024 Daymon Littrell-Reyes
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { reverseArray } from "@rbxts/reverse-array";
import { RunService } from "@rbxts/services";
import { LogEnricherCallback, LogEntry, LogLevel, LogSinkCallback } from "../common";
import { RLog } from "../rlog";

const isStudio = RunService.IsStudio();

/**
 * Configuration settings for serialization.
 *
 * @see {@link RLogConfig}
 *
 * @public
 */
export interface SerializationConfig {
  /**
   * Whether to encode Roblox-specific types.
   *
   * @remarks
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
   * Whether to encode function types.
   *
   * @remarks
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
   * @remarks
   *
   * When disabled, tables will not be recursively encoded, which may cause you
   * to miss out on certain data types being properly translated (e.g., roblox data types).
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
   * The method name to use for class encoding.
   *
   * @remarks
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
}

/**
 * Default configuration for serialization.
 *
 * @internal
 */
export const defaultSerializationConfig: Readonly<SerializationConfig> = {
  encodeRobloxTypes: true,
  encodeFunctions: false,
  encodeMethod: "__tostring",
  deepEncodeTables: true,
};

/**
 * Configuration settings for {@link RLog}.
 *
 * @public
 */
export interface RLogConfig {
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
   * Function to generate correlation IDs.
   *
   * @remarks
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
   * String to prefix to all logs.
   *
   * Will be followed by a `->` between the log message and the log level.
   *
   * @remarks
   *
   * This setting is ignored when merging configs.
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
   * @remarks
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
   * @remarks
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
}

/**
 * Default configuration for {@link RLog}.
 *
 * @internal
 */
export const defaultRLogConfig: Readonly<RLogConfig> = {
  minLogLevel: isStudio ? LogLevel.VERBOSE : LogLevel.WARNING,
  serialization: defaultSerializationConfig,
  contextBypass: false,
  suspendContext: false,
};

/**
 * Version of {@link RLogConfig} that allows all data to be absent.
 *
 * @public
 */
export type PartialRLogConfig = Partial<ExcludeMembers<RLogConfig, SerializationConfig>> & {
  readonly serialization?: Partial<SerializationConfig>;
};

/**
 * Merges a variable amount of config files.
 *
 * @remarks
 *
 * Configs that come later take precedence over those before.
 *
 * Uses the {@link defaultRLogConfig | default} config as a baseline.
 *
 * @param configs - A variable list of config files to merge together.
 *
 * @returns The merged config files.
 *
 * @internal
 */
// TODO(): see if there's any use case where we _wouldn't_ want the default config involved
// TODO(): reduce the amount of places where we need to call this. maybe make primary constructors take in full rLog configs or something idk
export function mergeConfigs(...configs: ReadonlyArray<PartialRLogConfig | undefined>): RLogConfig {
  const validConfigs = configs.filterUndefined();

  const serialization = validConfigs.reduce(
    (acc, it) => ({
      ...acc,
      ...(it.serialization ?? {}),
    }),
    defaultSerializationConfig
  );

  const mergedConfigs = validConfigs.reduce<PartialRLogConfig>(
    (acc, it) => ({
      ...acc,
      ...(it ?? {}),
      tag: it.tag,
    }),
    defaultRLogConfig
  );

  // TODO(): cleanup. there needs to be a better way to do this
  // note: could also check if the last config is actually even a partial. cause if it's not, we can just return it deep copied
  const addedSinks = new Set<LogSinkCallback>();
  const addedEnrichers = new Set<LogEnricherCallback>();

  const enrichers: LogEnricherCallback[] = [];
  const sinks: LogSinkCallback[] = [];

  const flipped = reverseArray(validConfigs);

  for (const config of flipped) {
    config.sinks?.forEach((it) => {
      if (!addedSinks.has(it)) {
        addedSinks.add(it);
        sinks.push(it);
      }
    });
    config.enrichers?.forEach((it) => {
      if (!addedEnrichers.has(it)) {
        addedEnrichers.add(it);
        enrichers.push(it);
      }
    });
  }

  return {
    ...mergedConfigs,
    sinks: [...sinks],
    enrichers: [...enrichers],
    serialization: serialization,
  } as RLogConfig;
}
