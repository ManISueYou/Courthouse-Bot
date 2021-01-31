import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as db from "quick.db";

export default class OverRuleCommand extends Command {
  public constructor() {
    super("overrule", {
      aliases: ["overrule", "deny", "reject", "or"],
      category: "Judge Commands",
      description: {
        content: "OverRules a Motion, Declaration, Object, etc...",
        usage: "!overrule [ reason ]",
        examples: [
          "!overrule Unspecified Reason\n!overruled There is not substantial evidence that can aqquit the defendant beyond a reasonable doubt.",
        ],
      },
      ratelimit: 30,
      args: [
        {
          id: "reason",
          type: "string",
          match: "rest",
          prompt: {
            start: `**Please Provide a Reason on Why You Are Overruling.**`,
            cancel: `You have canceled your attempt to overrule.`,
            time: 30000,
          },
        },
      ],
    });
  }

  public exec(
    message: Message,
    { reason }: { reason: string }
  ): Promise<Message> {
    let guildID = message.guild.id;
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
        return message.util.send({
          embed: {
            color: 16733013,
            title: `Overruled`,
            description: `${reason}`,
            footer: {
              icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
              text: `OverRuled | Courthouse Bot`,
            },
            timestamp: new Date(),
            author: {
              icon_url: message.author.displayAvatarURL(),
              name: `Ruling | Courthouse Bot`,
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
      return message.util.send({
        embed: {
          color: 16733013,
          title: `Motion Overruled`,
          description: `${reason}`,
          footer: {
            icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
            text: `OverRuled | Courthouse Bot`,
          },
          timestamp: new Date(),
          author: {
            icon_url: message.author.displayAvatarURL(),
            name: `Ruling | Courthouse Bot`,
          },
        },
      });
    }
  }
  
}
