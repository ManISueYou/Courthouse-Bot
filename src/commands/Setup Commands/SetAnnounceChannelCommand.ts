import { Command } from "discord-akairo";
import { Channel } from "discord.js";
import { Message } from "discord.js";
import * as db from "quick.db";

export default class SetAnnounceChannelCommand extends Command {
  public constructor() {
    super("setannouncechannel", {
      aliases: ["setannouncechannel", "setannounce"],
      category: "Setup Commands",
      description: {
        content: "Sets the channel for the `!announce` Command",
        usage: "!setannouncechannel [ channel ]",
        examples: ["!setannouncechannel #announcements"],
      },
      userPermissions: ["MANAGE_GUILD"],
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

  public exec(
    message: Message, { channel }: { channel: Channel }): Promise<Message> {
    let guildID = message.guild.id;
    db.set(`announcementchannel${guildID}`, channel.id);
    return message.channel.send({
      embed: {
        color: 9240450,
        title: `Announcement Channel Changed`,
        description: `${channel} is now the announcement channel`,
        footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Success | Courthouse Bot`,
        },
        timestamp: new Date(),
        author: {
          icon_url: message.author.displayAvatarURL(),
          name: `Announce | Courthouse Bot`,
        },
      },
    });
  }
}
