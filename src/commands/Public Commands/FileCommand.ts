import { Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";
import * as db from "quick.db";

export default class FileCommand extends Command {
  public constructor() {
    super("file", {
      aliases: ["file", "casefile", "filecase"],
      category: "Public Commands",
      description: {
        content: "Files a case",
        usage: "!file [ explanation ]",
        examples: [
          "!file I believe Jeff has possession of drugs, I would like a hearing for a search warrant.",
        ],
      },
      ratelimit: 1,
      cooldown: 500,
      args: [
        {
          id: "name",
          type: "string",
          prompt: {
            start: `**Please Title Your Claim**`,
            cancel: `You have canceled your attemptempted case filing.`,
            time: 30000,
          },
        },
        {
          id: "details",
          type: "string",
          match: "rest",
          prompt: {
            start: `**Please Give Details of Your Claim**`,
            cancel: `You have canceled your attemptempted case filing.`,
            time: 30000,
          },
        },
      ],
    });
  }

  public exec(message: Message, { name, details }: { name: string; details: string }): Promise<Message> {
    let guildID = message.guild.id;
    let judgeRole = db.get(`JudgeRole${guildID}`);
    if (!judgeRole || judgeRole == null || judgeRole == undefined) {
      return message.reply(`You are either not a judge or the judge role has not been setup.`)
    }
    try {
      message.guild.channels
        .create(`${message.author.username}-${name}`, {
          type: "text",
          permissionOverwrites: [
            {
              id: message.author.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
            {
              id: message.guild.roles.everyone,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: String(judgeRole),
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
          ],
        })
        .then(async (channel) => {
          message.reply(`Case Filed.`);
          channel.send(`@here`, {
            embed: {
              color: 9240450,
              title: `Case Filed: ${name}`,
              description: `${details}`,
              footer: {
                icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
                text: `Success | Courthouse Bot`,
              },
              timestamp: new Date(),
              author: {
                icon_url: message.author.displayAvatarURL(),
                name: `Case Filing | Courthouse Bot`,
              },
            },
          });
          let logs = db.get(`caselogs${guildID}`)
          let logsChannel: TextChannel = this.client.channels.cache.get(
            logs
          ) as TextChannel;
          if (!logs || logs == null || logs == undefined) { return; } else { 
            logsChannel.send({
              embed: {
                color: 9240450,
                title: `Case Filed By ${message.author.tag}`,
                description: `${details}`,
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
        });
    } catch {
      console.error();
      return message.reply(
        `An Unexpected Error has Occurred, Try Again Later.`
      );
    }
  }
}
