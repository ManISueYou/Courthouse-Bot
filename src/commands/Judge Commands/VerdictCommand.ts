import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as db from "quick.db";

export default class VerdictCommand extends Command {
  public constructor() {
    super("verdict", {
      aliases: ["verdict", "ifindthedefendant", "outcome"],
      category: "Judge Commands",
      description: {
        content: "States a verdict of a case.",
        usage: "!verdict [outcome] [*optional reasoning or other words]",
        examples: [
          "!verdict guilty The court goes into recess, until sentencing..",
          "!verdict not guilty The Court Is Now Ajourned."
        ],
      },
      ratelimit: 30,
      typing: true,
      args: [
        {
          id: `verdict`,
          type: `string`,
        },
        {
          id: `reason`,
          type: `string`,
          match: "rest",
        },
      ],
    });
  }

  public exec(
    message: Message,
    { verdict, reason }: { verdict: string; reason: string }
  ): Promise<Message> {
    let guildID = message.guild.id;
    let judgeRole = db.get(`JudgeRole${guildID}`);
    let verdictL = verdict.toLowerCase();
    if (!judgeRole || judgeRole == null || judgeRole == undefined) {
      if (
        !message.member.roles.cache.some((role) =>
          ["Judge"].includes(role.name)
        )
      ) {
        return message.util.send(
          `Why in the world would you try and and make a verdict, when you aren't a judge?` //Lol Idiot
        );
      }
    } else {
      if (verdictL == `guilty`) {
        return message.util.send(`@here`, {
          embed: {
            color: 16733013,
            title: `A Verdict Has Been Reached.`,
            description: `Guilty. ${reason}`,
            footer: {
              icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
              text: `Success | Courthouse Bot`,
            },
            timestamp: new Date(),
            author: {
              icon_url: message.author.displayAvatarURL(),
              name: `Verdict | Courthouse Bot`,
            },
          },
        });
      }
      if (verdictL == `not guilty` || `notguilty`) {
        return message.util.send(`@here`, {
          embed: {
            color: 9240450,
            title: `A Verdict Has Been Reached`,
            description: `Not Guilty. ${reason}`,
            footer: {
              icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
              text: `Success | Courthouse Bot`,
            },
            timestamp: new Date(),
            author: {
              icon_url: message.author.displayAvatarURL(),
              name: `Verdict | Courthouse Bot`,
            },
          },
        });
      }
      return message.util.send(`@here`, {
        embed: {
          color: 16733013,
          title: "Please Make Sure Your Verdict is Either `guilty` or `not guilty`",
          description: `${reason}`,
          footer: {
            icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
            text: `Error | Courthouse Bot`,
          },
          timestamp: new Date(),
          author: {
            icon_url: message.author.displayAvatarURL(),
            name: `Verdict | Courthouse Bot`,
          },
        },
      });
    }
  }
}
