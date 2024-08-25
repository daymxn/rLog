/// <reference types="@rbxts/testez/globals" />
import Object, { deepEquals } from "@rbxts/object-utils";
import { HttpService, LogService } from "@rbxts/services";
import { includes, startsWith } from "@rbxts/string-utils";
import { t } from "@rbxts/t";
import { LogData, LogEntry, LogLevel, SourceMetadata } from "../common";
import { LogContext, LogContextManager, withLogContext } from "../context";
import { rlog } from "../rlog";
import { bind, check } from "./matchers";

// TODO(): maybe split into separate files?

type LoggedMessage<T = LogData> = {
  level: LogLevel;
  text: string;
  data?: T;
  extra: {
    source_metadata?: SourceMetadata;
    timestamp: number;
    correlation_id?: string;
  };
};

const mustBeALogLevel = t.keyOf(LogLevel);

const MessageFormat = "%[(%a+)%]:%s(.+)\n(.+)";

// TODO(): Future work -> assertions library? also need a deepcopy that exports better messages
// TODO(): clean this shit up jesus
// TODO(): add tests for provided sinks and enrichers whenever I split this up
export = () => {
  function parseMessage(message: string) {
    const [level, text, extra] = message.match(MessageFormat);
    assert(mustBeALogLevel(level));
    assert(t.string(text));
    assert(t.string(extra));

    const data = HttpService.JSONDecode(extra) as LogData;

    assert(t.number(data.timestamp));

    return {
      level: LogLevel[level],
      text: text,
      data: data["data"] as LogData,
      extra: {
        ...data,
      },
    };
  }

  const messages: string[] = [];

  function getMessages<T = Record<string, unknown>>(canBeEmpty: boolean = false): LoggedMessage<T>[] {
    task.wait();

    const history = [...messages];
    if (!canBeEmpty) check(history.isEmpty()).to.equal(false);

    return history.map((it) => parseMessage(it)) as LoggedMessage<T>[];
  }

  beforeAll(() => {
    bind(expect);
    LogService.MessageOut.Connect((message) => {
      messages.push(message);
    });
  });

  beforeEach(() => {
    task.wait();
    messages.clear();
    LogContextManager.clear();
    rlog.ResetDefaultConfig();

    task.wait();
  });

  describe("loggers", () => {
    it("should output to the console", () => {
      const logger = new rlog();

      logger.log(LogLevel.INFO, "Hello world!");

      task.wait();
      check(messages.isEmpty()).to.equal(false);

      const message = messages[0];
      check(includes(message, "Hello world!")).to.equal(true);
    });

    it("should output data", () => {
      const logger = new rlog();

      logger.log(LogLevel.INFO, "Hello world!", { person: "me!" });

      const message = getMessages()[0];

      check(message?.data?.["person"]).to.equal("me!");
    });

    it("should respect all the log levels", () => {
      const logger = new rlog();

      for (const level of Object.values(LogLevel)) {
        logger.log(level, LogLevel[level]);
      }

      const messages = getMessages();

      for (const message of messages) {
        check(LogLevel[message.level]).to.equal(message.text);
      }
    });

    it("should use the correct log levels", () => {
      const logger = new rlog();

      logger.v("VERBOSE");
      logger.verbose("VERBOSE");

      logger.i("INFO");
      logger.info("INFO");

      logger.d("DEBUG");
      logger.debug("DEBUG");

      logger.w("WARNING");
      logger.warn("WARNING");
      logger.warning("WARNING");

      logger.e("ERROR");
      logger.error("ERROR");

      const messages = getMessages();

      for (const message of messages) {
        check(LogLevel[message.level]).to.equal(message.text);
      }
    });

    it("should not log below min log level", () => {
      const logger = new rlog({ minLogLevel: LogLevel.WARNING });

      for (const level of Object.values(LogLevel)) {
        logger.log(level, "Message");
      }

      const messages = getMessages();

      const possibleLevels = [LogLevel.WARNING, LogLevel.ERROR];

      for (const message of messages) {
        check(possibleLevels).to.contain(message.level);
      }
    });

    it("should use tags", () => {
      const logger = new rlog().withTag("cool");

      logger.i("Message");

      const message = getMessages()[0];

      check(startsWith(message.text, "cool")).to.equal(true);
    });

    it("should inherit default settings", () => {
      rlog.SetDefaultConfig({ minLogLevel: LogLevel.ERROR });
      const logger = new rlog({ serialization: { encodeRobloxTypes: false } });

      check(logger._config).to.matchObject({
        minLogLevel: LogLevel.ERROR,
        serialization: {
          encodeRobloxTypes: false,
        },
      });
    });

    it("should override default settings", () => {
      rlog.SetDefaultConfig({ minLogLevel: LogLevel.ERROR });
      const logger = new rlog({ minLogLevel: LogLevel.WARNING });

      check(logger._config.minLogLevel).to.equal(LogLevel.WARNING);
    });

    it("should merge configs", () => {
      const main = new rlog({ serialization: { encodeFunctions: true } });
      const secondary = main.withConfig({ serialization: { encodeRobloxTypes: false } });

      const data = {
        position: new Vector2(5, 10),
        callback: () => {},
      };

      secondary.i("Message", data);

      const message = getMessages()[0];

      check(message.data).to.matchObject({
        position: "<Vector2>",
        callback: "<Function>",
      });
    });
  });

  describe("serialization", () => {
    it("should serialize nested tables", () => {
      const logger = new rlog({ serialization: { deepEncodeTables: true } });

      const data = { player: { name: "daymon", position: new Vector3(1, 2, 3) } };

      logger.i("Message", data);

      const message = getMessages<typeof data>()[0];

      check(message.data).to.matchObject({
        player: {
          name: "daymon",
          position: { X: 1, Y: 2, Z: 3 },
        },
      });
    });

    it("should not serialize nested tables", () => {
      const logger = new rlog({ serialization: { deepEncodeTables: false } });

      const data = { player: { name: "daymon", position: new Vector3(1, 2, 3) } };

      logger.i("Message", data);

      const message = getMessages<typeof data>()[0];

      check(message.data?.player.name).to.equal(data.player.name);
      check(message.data?.player.position).to.equal(undefined);
    });

    it("should serialize functions", () => {
      const logger = new rlog({ serialization: { encodeFunctions: true } });

      logger.i("Message", { callback: () => {} });

      const message = getMessages()[0];

      check(message.data?.callback).to.equal("<Function>");
    });

    it("should not serialize functions", () => {
      const logger = new rlog({ serialization: { encodeFunctions: false } });

      logger.i("Message", { callback: () => {} });

      const message = getMessages()[0];

      check(message.data?.callback).to.equal(undefined);
    });

    it("should serialize roblox types", () => {
      const logger = new rlog({ serialization: { encodeRobloxTypes: true } });

      const data = { position: new Vector2(1, 2) };

      logger.i("Message", data);

      const message = getMessages()[0];

      const position = message.data?.position as object;

      check(deepEquals(position, { X: 1, Y: 2 })).to.equal(true);
    });

    it("should not serialize roblox types", () => {
      const logger = new rlog({ serialization: { encodeRobloxTypes: false } });

      const data = { position: new Vector2(1, 2) };

      logger.i("Message", data);

      const message = getMessages()[0];

      check(message.data?.position).to.equal("<Vector2>");
    });

    it("should call the proper encode method", () => {
      const playerInstance = {
        name: "Nuketown",
        year: 2025,

        encode: () => {
          return playerInstance.name;
        },
      };

      const logger = new rlog({ serialization: { encodeMethod: "encode" } });

      const data = { player: { instance: playerInstance } };

      logger.i("Message", data);

      const message = getMessages<typeof data>()[0];

      check(message.data?.player?.instance).to.equal(playerInstance.encode());
    });

    it("should catch self references", () => {
      const logger = new rlog();

      const data = { name: "daymon", owner: {} };
      data.owner = data;

      logger.i("Message", data);

      const message = getMessages()[0];

      check(message.data?.name).to.equal(data.name);
      check(message.data?.owner).to.equal("<PtrToSelf>");
    });

    it("should serialize complex types", () => {
      const logger = new rlog({
        serialization: { encodeFunctions: true, encodeRobloxTypes: true },
      });

      const data = {
        name: "michael jackson",
        son: {},
        age: 50,
        location: {
          position: new Vector3(1, 2, 3),
          rotation: CFrame.Angles(1, 2, 3),
        },
        foods: ["pizza", "chicken", "ice cream"],
        songs: [
          {
            chart: 1,
            name: "Billie Jean",
            streams: {
              daily: 1_275_673,
              total: 1_825_629_259,
              locations: [new Vector3(1, 0, 1), new Vector2(9, 5)],
            },
          },
          {
            chart: 4,
            name: "Thriller",
            streams: {
              daily: 282_714,
              total: 613_444_407,
              locations: [new Vector3(1, 0, 1), new Vector2(9, 5)],
            },
          },
          {
            chart: 15,
            name: "Chicago",
            streams: {
              daily: 297_643,
              total: 283_537_103,
              locations: [new Vector3(1, 0, 1), new Vector2(9, 5)],
            },
          },
        ],
        extra: {
          spawn: game.Workspace.CurrentCamera,
          lighting: 3.14159,
          video_status: Enum.AdEventType.VideoLoaded,
          present: false,
          sing: () => {},
        },
      };
      data.son = data;

      const expectedResult = {
        ...data,
        son: "<PtrToSelf>",
        location: {
          position: { X: 1, Y: 2, Z: 3 },
          rotation: `CFrame(${data.location.rotation.GetComponents().join(", ")})`,
        },
        songs: data.songs.map((it) => ({
          ...it,
          streams: {
            ...it.streams,
            locations: [
              { X: 1, Y: 0, Z: 1 },
              { X: 9, Y: 5 },
            ],
          },
        })),
        extra: {
          ...data.extra,
          spawn: "Workspace.Camera",
          video_status: "Enum.AdEventType.VideoLoaded",
          sing: "<Function>",
        },
      };

      logger.i("Message", data);

      const message = getMessages()[0]?.data as object;

      check(deepEquals(message, expectedResult)).to.equal(true);
    });
  });

  describe("sinks", () => {
    it("should consume messages", () => {
      const sink = () => {
        return true;
      };

      const logger = new rlog({ sinks: [sink] });

      logger.i("Message");

      const messages = getMessages(true);

      check(messages.isEmpty()).to.equal(true);
    });

    it("should pass messages", () => {
      let called = false;
      const firstSink = () => {
        return false;
      };

      const secondSink = () => {
        called = true;
        return false;
      };

      const logger = new rlog({ sinks: [firstSink, secondSink] });

      logger.i("Message");

      const messages = getMessages(true);

      check(messages.isEmpty()).to.equal(false);
      check(called).to.equal(true);
    });
  });

  describe("enrichers", () => {
    it("should change type", () => {
      const enricher = (entry: LogEntry) => {
        entry.message = "changed";
        return entry;
      };

      const logger = new rlog({ enrichers: [enricher] });

      logger.i("Message");

      const message = getMessages()[0];

      check(message.text).to.equal("changed");
    });

    it("should pass messages", () => {
      const firstEnricher = (entry: LogEntry) => {
        entry.message = "changed";
        return entry;
      };

      const secondEnricher = (entry: LogEntry) => {
        entry.message = `${entry.message}2`;
        return entry;
      };

      const logger = new rlog({ enrichers: [firstEnricher, secondEnricher] });

      logger.i("Message");

      const message = getMessages()[0];

      check(message.text).to.equal("changed2");
    });
  });

  describe("context", () => {
    it("should generate correlation ids", () => {
      const context = LogContext.start();

      check(context.correlation_id).to.be.ok();
    });

    it("should use custom generator", () => {
      const generate = () => "test";

      const context = LogContext.start({ correlationGenerator: generate });
      check(context.correlation_id).to.equal("test");
    });

    it("should create valid rLog instances", () => {
      const context = LogContext.start();

      const logger = context.use();

      check(logger.context).to.be.ok();
      check(logger.context?.correlation_id).to.equal(context.correlation_id);
    });

    it("should merge configs", () => {
      const firstConfig = { minLogLevel: LogLevel.ERROR };
      const secondConfig = { tag: "x", serialization: { encodeRobloxTypes: false } };

      const context = LogContext.start(firstConfig);
      const logger = context.use(secondConfig);

      const combinedConfig = { ...firstConfig, ...secondConfig };

      check(logger._config).to.matchObject(combinedConfig);
    });

    it("should error when dead", () => {
      const context = LogContext.start();
      context.stop();

      expect(() => context.use()).to.throw("dead");
      expect(() => context.withConfig({})).to.throw("dead");
    });

    it("should accept new configs", () => {
      const context = LogContext.start({ minLogLevel: LogLevel.ERROR });
      const newContext = context.withConfig({ tag: "x" });

      check(context.correlation_id).to.equal(context.correlation_id);
      expect(context.config.tag).to.equal(undefined);
      expect(newContext.config.tag).to.equal("x");
    });

    it("should handle the lifecycle when expected", () => {
      const context = withLogContext((newContext) => {
        const logger = newContext.use();
        logger.i("Message");

        return newContext;
      });

      expect(context.IsDead()).to.equal(true);
    });

    it("should output the correlation id", () => {
      const context = LogContext.start();

      const logger = context.use();

      logger.i("Message");

      const message = getMessages()[0];

      expect(message.extra.correlation_id).to.equal(context.correlation_id);
    });

    it("should not mix correlation ids", () => {
      const firstContext = LogContext.start();
      const secondContext = LogContext.start();

      const firstLogger = firstContext.use();
      const secondLogger = secondContext.use();

      firstLogger.i("Message");
      secondLogger.i("Message");

      const messages = getMessages();

      const firstMessage = messages[0];
      const secondMessage = messages[1];

      expect(firstContext.correlation_id).to.never.equal(secondContext.correlation_id);
      expect(firstMessage.extra.correlation_id).to.equal(firstContext.correlation_id);
      expect(secondMessage.extra.correlation_id).to.equal(secondContext.correlation_id);
    });

    it("should maintain context when enabled", () => {
      const context = LogContext.start();

      const logger = context.use({ minLogLevel: LogLevel.WARNING, contextBypass: true });
      const otherLogger = new rlog({ minLogLevel: LogLevel.WARNING });

      otherLogger.info("Message without correlation ID");

      logger.d("First message");
      logger.d("Second message");

      const messagesBeforeError = getMessages(true);
      expect(messagesBeforeError.isEmpty()).to.equal(true);

      logger.w("Third message");
      logger.d("Fourth message");

      const messagesAfterError = getMessages();
      expect(messagesAfterError.size()).to.equal(1);

      context.stop();

      const messagesAfterStop = getMessages();
      expect(messagesAfterStop.size()).to.equal(4);
    });

    it("should suspend context when enabled", () => {
      const context = LogContext.start();

      const logger = context.use({ suspendContext: true });

      logger.d("First message");
      logger.d("Second message");
      logger.e("Third message");

      const messagesBeforeStop = getMessages(true);
      expect(messagesBeforeStop.isEmpty()).to.equal(true);

      context.stop();

      const messagesAfterStop = getMessages();
      expect(messagesAfterStop.size()).to.equal(3);
    });
  });
};
