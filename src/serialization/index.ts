import Object from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { LogData } from "../common";
import { SerializationConfig } from "../configuration";

/**
 * Encodes an element to a JSON string.
 *
 * Internally just wraps around {@link HttpService.JSONEncode} to avoid
 * errors.
 *
 * @param element - The element to encode.
 *
 * @returns The JSON string, or undefined if encoding fails.
 */
function encodeToJson(element: unknown): string | undefined {
  try {
    return HttpService.JSONEncode(element);
  } catch (e) {
    return undefined;
  }
}

/**
 * Encodes an element to a JSON string or returns the element as a string.
 *
 * Variant of {@link encodeToJson} that calls {@link tostring} on failure.
 *
 * @param element - The element to encode.
 *
 * @returns The JSON string if encoding is successful, otherwise the result of
 * calling {@link tostring} on the element.
 *
 * @internal
 */
export function encodeToJsonOrString(element: unknown): string {
  return encodeToJson(element) ?? tostring(element);
}

/**
 * Serializes specific Roblox types to a a valid JSON representation.
 *
 * @param value - The value to serialize.
 *
 * @returns A valid JSON representation of the value, or undefined if the type is not supported.
 */
function serializeRobloxType(value: unknown): EncodableValue | undefined {
  if (typeIs(value, "Vector3")) {
    return {
      X: value.X,
      Y: value.Y,
      Z: value.Z,
    };
  }

  if (typeIs(value, "Vector2")) {
    return {
      X: value.X,
      Y: value.Y,
    };
  }

  if (typeIs(value, "Instance")) {
    return value.GetFullName();
  }

  if (typeIs(value, "EnumItem")) {
    return tostring(value);
  }

  if (typeIs(value, "CFrame")) {
    return `CFrame(${value.GetComponents().join(", ")})`;
  }

  return undefined;
}

/**
 * Helper type to force typescript to let us call methods on {@link object objects}.
 */
type ElementWithEncodeCallback = {
  [any: string]: unknown;
};

/**
 * Values that can be present in an {@link object} and properly encoded
 * to JSON.
 */
type EncodableValue = string | number | boolean | object;

function isArray(element: unknown): element is defined[] {
  return t.array(t.any)(element);
}

/**
 * Encodes a table element according to the {@link config}.
 *
 * This method also catches self reference and converts them to `<PtrToSelf>`
 * to avoid stack overflows. Although, if there's more complex cyclic references,
 * this will not catch them.
 *
 * @param config - The serialization configuration.
 * @param element - The table element to encode.
 *
 * @returns A valid value that can be encoded into a JSON element.
 */
function encodeTable(config: SerializationConfig, element: object): EncodableValue {
  if (config.encodeMethod in element) {
    const method = (element as ElementWithEncodeCallback)[config.encodeMethod];
    if (typeIs(method, "function")) {
      return method() as object;
    }
  }

  if (isArray(element)) return element.map((it: unknown) => encodeToObjectOrString(config, it));

  if (!config.deepEncodeTables) return element;

  const newElement: Record<string, EncodableValue | undefined> = {};

  for (const [key, value] of Object.entries(element)) {
    if (value === element) {
      newElement[`${key}`] = `<PtrToSelf>`;
    } else {
      newElement[`${key}`] = encodeToObjectOrString(config, value);
    }
  }

  return newElement;
}

/**
 * Encodes an element to a valid JSON element according to the {@link config}.
 *
 * @param config - The serialization configuration.
 * @param element - The element to encode.
 *
 * @returns An encodable value or undefined if the element cannot be encoded.
 */
function encodeToObjectOrString(config: SerializationConfig, element: unknown): EncodableValue | undefined {
  const elementType = typeOf(element);

  switch (elementType) {
    case "number":
    case "string":
    case "boolean":
      return element as EncodableValue;
    case "table": {
      return encodeTable(config, element as object);
    }
    case "function": {
      return config.encodeFunctions ? "<Function>" : undefined;
    }
    default: {
      if (!config.encodeRobloxTypes) return `<${elementType}>`;

      return serializeRobloxType(element) ?? `<${elementType}>`;
    }
  }
}

/**
 * Public facing serialization. Converts to valid json according to config.
 */
export function serialize(config: SerializationConfig, element: LogData): LogData {
  const encodedElement = encodeToObjectOrString(config, element);

  // TODO(): refactor so this cast isn't needed
  return encodedElement as LogData;
}
