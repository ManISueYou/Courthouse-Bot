import { Command } from "discord-akairo";
import { Message, Channel } from "discord.js";
import * as db from "quick.db";

export default class SetLogChannelCommand extends Command {
  public constructor() {
    super("setlogchannel", {
      aliases: ["setlogchannel", "setlog", "setlogs", "setcaselogs", "setcaselogschannel", "setlogschannel"],
      category: "Setup Commands",
      description: {
        content: "Sets the case log channel for cases.",
        usage: "!setlogchannel [ channel ]",
        examples: ["!setlogchannel #caselogs"],
      },
      ratelimit: 3,
      args: [
        {
          id: "channel",
          type: "channel",
          prompt: {
            start: `**Please Provide a Channel.**`,
            cancel: `You have canceled your attempt to set an announcement channel.`,
            time: 30000,
          },
        },
      ],
    });
  }

  public exec(message: Message, { channel }: { channel: Channel }): Promise<Message> {
    let guildID = message.guild.id;
    db.set(`caselogs${guildID}`, channel.id);
    return message.util.send({
      embed: {
        color: 9240450,
        title: `Case Logs Channel Changed`,
        description: `${channel} is now the Case Logs channel`,
        footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Success | Courthouse Bot`,
        },
        timestamp: new Date(),
        author: {
          icon_url: message.author.displayAvatarURL(),
          name: `Case Logs | Courthouse Bot`,
        },
      },
    });
  }
}
