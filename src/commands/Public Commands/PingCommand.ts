import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as db from "quick.db";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "pong"],
      category: "Public Commands",
      description: {
        content: "Check the Latency or Ping of The Bot",
        usage: "!ping",
        examples: ["!ping"],
      },
      ratelimit: 30,
    });
  }

  public exec(message: Message): Promise<Message> {
    return message.util.send({
      embed: {
        color: 10038562,
        title: "🏓 PONG!",
        description: `The Ping or Latency, from the host to discord is \`${this.client.ws.ping}\`ms`,
        footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Success | Courthouse Bot`,
        },
        timestamp: new Date(),
        author: {
          icon_url: message.author.displayAvatarURL(),
          name: `Courthouse Bot | Ping`,
        },
      },
    });
  }
}
