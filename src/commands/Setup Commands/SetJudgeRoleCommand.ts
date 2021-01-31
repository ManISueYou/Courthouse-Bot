import { Command } from "discord-akairo";
import { Role } from "discord.js";
import { Message } from "discord.js";
import * as db from "quick.db";

export default class SetJudgeRoleCommand extends Command {
  public constructor() {
    super("setjudgerole", {
      aliases: ["setjudgerole", "setjudge"],
      category: "Setup Commands",
      description: {
        content: "Sets the Judge Role, for Judge Commands to be used.",
        usage: "!setjudgerole [ role ]",
        examples: ["!setjudgerole @Judge"],
      },
      ratelimit: 3,
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          id: `role`,
          type: `role`,
          prompt: {
            start: `**Please Provide a Role.**`,
            cancel: `You have canceled your attempt to set a judge role.`,
            time: 30000,
          },
        },
      ],
    });
  }

  public exec(message: Message, { role }: { role: Role }): Promise<Message> {

    let guildID = message.guild.id;
    
    db.set(`JudgeRole${guildID}`, role.id)

    return message.channel.send({
      embed: {
        color: 9240450,
        title: `Judge Role Changed`,
        description: `${role} is now the Judge Role`,
        footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Success | Courthouse Bot`,
        },
        timestamp: new Date(),
        author: {
          icon_url: message.author.displayAvatarURL(),
          name: `Judge | Courthouse Bot`,
        },
      },
    });
  }
}
