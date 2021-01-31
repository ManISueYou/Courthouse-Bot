import { Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";
import * as db from "quick.db";

export default class AnnnounceCommand extends Command {
  public constructor() {
    super("announce", {
      aliases: ["announce", "announcement"],
      category: "Judge Commands",
      description: {
        content: "Announces in the set channel",
        usage: "!annouce [text]",
        examples: ["!announce We shall make the hearing public."],
      },
      ratelimit: 30,
      args: [
        {
          id: "text",
          type: "string",
          match: "rest",
          prompt: {
            start: `**Please Announcement Text**`,
            cancel: `You have canceled your attemptempted announcement.`,
            time: 30000,
          },
        },
      ],
    });
  }

  public exec(message: Message, { text }: { text: string }): Promise<Message> {
    let guildID = message.guild.id;
    let announcechannel = db.get(`announcementchannel${guildID}`);
    let channel: TextChannel = this.client.channels.cache.get(
      announcechannel
    ) as TextChannel;
    if (
      announcechannel == null ||
      !announcechannel ||
      announcechannel == undefined ||
      !channel
    ) {
      return message.util.send({
        embed: {
          color: 16733013,
          description: `No Announcement Channel is set, please do \`!help announcechannel`,
          footer: {
            icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
            text: `Error | Courthouse Bot`,
          },
          timestamp: new Date(),
          author: {
            icon_url: message.author.displayAvatarURL(),
            name: `Announce | Courthouse Bot`,
          },
        },
      });
    } else {
      let judgeRole = db.get(`JudgeRole${guildID}`);
      if (!judgeRole || judgeRole == null || judgeRole == undefined) {
        if (
          !message.member.roles.cache.some((role) =>
            ["Judge"].includes(role.name)
          )
        ) {
          return message.util.send(
            `Why in the world would you try and announce something, when you aren't a judge?`
          );
        } else {
          return channel.send(`@everyone`, {
            embed: {
              color: 9240450,
              title: `Announcement from ${message.author.tag}`,
              description: `${text}`,
              footer: {
                icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
                text: `Success | Courthouse Bot`,
              },
              timestamp: new Date(),
              author: {
                icon_url: message.author.displayAvatarURL(),
                name: `Announcement | Courthouse Bot`,
              },
            },
          });
        }
      }
      if (!message.member.roles.cache.has(judgeRole)) {
        return message.util.send(
          `Why in the world would you try and announce something, when you aren't a judge?`
        );
      } else {
        return channel.send(`@everyone`, {
          embed: {
            color: 9240450,
            title: `Announcement from ${message.author.tag}`,
            description: `${text}`,
            footer: {
              icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
              text: `Success | Courthouse Bot`,
            },
            timestamp: new Date(),
            author: {
              icon_url: message.author.displayAvatarURL(),
              name: `Announcement | Courthouse Bot`,
            },
          },
        });
      }
    }
  }
}
