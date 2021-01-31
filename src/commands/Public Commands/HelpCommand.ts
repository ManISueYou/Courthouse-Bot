import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { prefix } from "../../Config";
import * as db from "quick.db";

export default class HelpCommand extends Command {
  public constructor() {
    super("help", {
      aliases: [
        "help",
        "helpme",
        "helpmepls",
        "plshelp",
        "helpmeplsiamsofuckingconfused",
        "h"
      ],
      category: "Public Commands",
      description: {
        content: "Helps out with learning this bot.",
        usage: "help",
        examples: ["ping"],
      },
      ratelimit: 60,
      args: [
        {
          id: "command",
          type: "commandAlias",
          default: null
        }
      ]
    });
  }

  public exec(message: Message, { command }: {command: Command}): Promise<Message> {
    if (command) {
      return message.util.send({
        embed: {
          color: 10038562,
          title: `Information about the ${command} command`,
          description: `**Description.**\n ${command.description.content || "Command Information Not Found."}\n **Usage:**\n ${command.description.usage || "Command Information Not Found."} \n **Examples:**\n ${command.description.examples ? command.description.examples.map(e => `\`${e}\``).join("\n") : "Unable to give an example."}`,
          footer: {
          icon_url: `https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png`,
          text: `Success | Courthouse Bot`,
        },
        timestamp: new Date(),
        author: {
          icon_url: message.author.displayAvatarURL(),
          name: `Courthouse Bot | Help | ${command}`,
        },
  }})
    }
    const embed = new MessageEmbed()
      .setAuthor(`Courthouse Bot | Help`, message.author.displayAvatarURL())
      .setColor(10038562)
      .setFooter(
        `Success | Courthouse Bot`,
        "https://images-ext-2.discordapp.net/external/pJ52xAFYjWy4YDMPcJwgrjvgkm2qyCMJ1Av6ir260io/https/0q0.eu/img/success.png"
    )
    for (const category of this.handler.categories.values()) {
      if (["default"].includes(category.id)) continue;
      embed.addField(category.id, category
        .filter(cmd => cmd.aliases.length > 0)
        .map(cmd => `**\`${prefix}${cmd}\`**`)
      .join(", " || "No Commands in this Category"))
    };
  return message.util.send(embed);
  }
}
