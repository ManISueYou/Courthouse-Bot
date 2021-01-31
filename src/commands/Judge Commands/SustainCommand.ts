import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as db from "quick.db";

export default class SustainCommand extends Command {
  public constructor() {
    super("sustain", {
      aliases: ["sustain", "accept", "approve", "sus", "sustained"],
      category: "Judge Commands",
      description: {
        content: "Sustains a Motion, Declaration, Objection, etc...",
        usage: "!sustain [ reason ]",
        examples: ["!sustain Case Dismissed."],
      },
      ratelimit: 30,
      args: [
        {
          id: "reason",
          type: "string",
          match: "rest",
          prompt: {
            start: `**Please Provide a Reason on Why You Are Sustaining.**`,
            cancel: `You have canceled your attempt to sutain.`,
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
    !message.member.roles.cache.some((role) => ["Judge"].includes(role.name))
  ) {
    return message.util.send(
      `Why in the world would you try and announce something, when you aren't a judge?`
    );
  } else {
    return message.util.send({
      embed: {
        color: 9240450,
        title: `Sustained!`,
        description: `${reason}`,
        footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Sustained | Courthouse Bot`,
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
      color: 9240450,
      title: `Motion Sustained!`,
      description: `${reason}`,
      footer: {
        icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
        text: `Sustained | Courthouse Bot`,
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
