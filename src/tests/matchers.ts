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

/// <reference types="@rbxts/testez/globals" />
import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";

function tryToEncode(element: defined) {
  try {
    return HttpService.JSONEncode(element);
  } catch (e) {
    return tostring(element);
  }
}

const contain: CustomMatchers = (source: defined[], value: defined) => {
  const pass = source.includes(value);

  return {
    pass: pass,
    message: `Expected ${tryToEncode(source)} to include ${value}`,
  };
};

// handles arrays, but not as you'd expect. should probably fix that
function deepChecker(
  prefix: string,
  source: Record<string, unknown>,
  other: Record<string, unknown>,
  checkInverse: boolean = true
): string | undefined {
  if (typeOf(other) !== "table") return `Expected a table, but was something else: "${typeOf(other)}" (${other})`;

  const sourceMembers = Object.entries(source);
  const destMembers = Object.entries(other);

  for (const [key, value] of sourceMembers) {
    const otherValue = other[key];
    const thisType = typeOf(value);
    const otherType = typeOf(otherValue);

    if (otherType === "nil") {
      return `Expected "${prefix}${key}" to be present, but it was missing.`;
    }

    if (thisType !== otherType) {
      return `Expected "${prefix}${key}" to be of type "${thisType}" (${value}), but was "${otherType}" (${otherValue}) instead.`;
    }

    if (thisType === "table") {
      const result = deepChecker(`${key}.`, value, otherValue as Record<string, unknown>, checkInverse);
      if (result !== undefined) return result;
    } else if (value !== otherValue) {
      return `Expected "${prefix}${key}" to equal ${value}, but it was ${otherValue} instead.`;
    }
  }

  if (checkInverse) {
    for (const [key, value] of destMembers) {
      if (source[key] === undefined) {
        return `Did not expect "${prefix}${key}" (${value}) to be present.`;
      }
    }
  }
}

const deepEqualMatcher: CustomMatchers = (source: defined, value: defined) => {
  const result = deepChecker("", source, value);

  return {
    pass: result === undefined,
    message: result,
  };
};

const matchObjectMatcher: CustomMatchers = (source: defined, value: defined) => {
  const result = deepChecker("", value, source, false);

  return {
    pass: result === undefined,
    message: result,
  };
};

type InferArrayElement<T> = T extends (infer U)[] ? U : never;

interface Checker<T> {
  readonly to: Checker<T>;
  readonly be: Checker<T>;
  readonly been: Checker<T>;
  readonly have: Checker<T>;
  readonly was: Checker<T>;
  readonly at: Checker<T>;
  readonly never: Checker<T>;

  a: (typeName: ReturnType<typeof typeOf>) => Checker<T>;
  an: (typeName: ReturnType<typeof typeOf>) => Checker<T>;
  ok: () => Checker<T>;
  equal: (otherValue: unknown) => Checker<T>;
  near: (this: Checker<number>, otherValue: number, limit?: number) => Checker<T>;
  throw: (this: Checker<Callback>, search?: string) => Checker<T>;
  contain: (this: Checker<T>, value: InferArrayElement<T>) => Checker<T>;
  deepEqual: (this: Checker<T>, value: T) => Checker<T>;
  matchObject: (this: Checker<T>, value: unknown) => Checker<T>;
  // some: (this: Checker<T>, values: T) => Checker<T>;
}

let exp = expect;

export function check<T>(value: T): Checker<T> {
  return exp(value) as unknown as Checker<T>;
}

export function bind(source: typeof expect) {
  source.extend({
    contain: contain,
    deepEqual: deepEqualMatcher,
    matchObject: matchObjectMatcher,
  });

  exp = source;
}
