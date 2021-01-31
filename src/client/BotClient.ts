//Imports
import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { User, Message } from "discord.js";
import { join } from "path";
import { prefix } from "../Config";

//Command Handler
declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

interface BotOptions {
  token?: string;
}

export default class BotClient extends AkairoClient {
  public config: BotOptions;
  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, "..", "listeners"),
  });
  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, "..", "commands"),
    prefix: prefix,
    allowMention: false,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 60000,
    defaultCooldown: 5000,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string =>
          `${str}\n\nType \`cancel\` to cancel the command...`,
        modifyRetry: (_: Message, str: string): string =>
          `${str}\n\nType \`cancel\` to cancel the command...`,
        timeout: "You took too long, the command has now been cancelled.",
        ended:
          "You exceeded the maxiumum amount of tries, the command has now been cancelled...",
        cancel: "This command has been cancelled...",
        retries: 3,
        time: 60,
      },
      otherwise: "",
    },
  });
  public constructor(config: BotOptions) {
    super({});
    this.config = config;
  }
  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });
    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }
  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
