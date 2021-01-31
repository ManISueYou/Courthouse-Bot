import { Command } from "discord-akairo";
import { Message, GuildMember, Role } from "discord.js";
import * as db from "quick.db";

export default class RemoveRoleCommand extends Command {
  public constructor() {
    super("removerole", {
      aliases: ["removerole", "rr"],
      category: "Judge Commands",
      description: {
        content: "Removes a Role from a Player",
        usage: "!removerole [ member ] [ role ]",
        examples: ["!removerole @Puzzling, Hey?#6626 @Judge"],
      },
      userPermissions: ["MANAGE_ROLES"],
      clientPermissions: ["MANAGE_ROLES"],
      ratelimit: 30,
      args: [
        {
          id: `user`,
          type: `member`,
          prompt: {
            start: `**Please a Member to Add the Role To.**`,
            cancel: `You have cancelled your attemppt to give a role.`,
            time: 30000,
          },
        },
        {
          id: `role`,
          type: `role`,
          prompt: {
            start: `**Please Provide a Role.**`,
            cancel: `You have canceled your attempt to give a role.`,
            time: 30000,
          },
        },
      ],
    });
  }

  public exec(
    message: Message,
    { user, role }: { user: GuildMember; role: Role }
  ): Promise<Message> {
    if (!user.manageable) {
      return message.util.send({
        embed: {
          color: 16733013,
          description: `This bot cannot remove roles to this member, please have a higher rank drag this bot above the person you're trying to add.\n If you are the owner, just change your roles, yourself.`,
          footer: {
            icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
            text: `Error | Courthouse Bot`,
          },
          timestamp: new Date(),
          author: {
            icon_url: message.author.displayAvatarURL(),
            name: `Role | Courthouse Bot`,
          },
        },
      });
    }
    if (
      user.roles.highest.position >= message.member.roles.highest.position &&
      message.author.id !== message.guild.ownerID
    ) {
      return message.util.send({
        embed: {
          color: 16733013,
          description: `This User Has Equal or Higher Roles than you..`,
          footer: {
            icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
            text: `Error | Courthouse Bot`,
          },
          timestamp: new Date(),
          author: {
            icon_url: message.author.displayAvatarURL(),
            name: `Role | Courthouse Bot`,
          },
        },
      });
    }
    try {
      user.roles.remove(role);
    } catch {
      console.error();
      return message.util.send({
        embed: {
          color: 16733013,
          description: `An Unexpected Error has Occured.`,
          footer: {
            icon_url: `https://images-ext-1.discordapp.net/external/LGvBIsduPKMp-ls0F7DfDuAX9orwqpdMSAAdkvErJG0/https/0q0.eu/img/error.png`,
            text: `Error | Courthouse Bot`,
          },
          timestamp: new Date(),
          author: {
            icon_url: message.author.displayAvatarURL(),
            name: `Role | Courthouse Bot`,
          },
        },
      });
    }

    return message.util.send({
      embed: {
        color: ``,
        description: `${role} Role Removed.`,
        footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Success | Courthouse Bot`,
        },
        timestamp: new Date(),
        author: {
          icon_url: message.author.displayAvatarURL(),
          name: `Give Role | Courthouse Bot`,
        },
      },
    });
  }
}
