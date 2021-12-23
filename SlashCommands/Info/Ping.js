const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "anan",
    description: "sa",
    cooldown: 5,
    options: null,
    async execute(client, interaction, args){const discord = require("discord.js");

    let start = Date.now();
    
        let embed1 = new discord.MessageEmbed()
        .setDescription("Looks like the bot is slow.")
        .setColor("RANDOM")
    
        await interaction.reply({
            embeds: [embed1], ephemeral: true
          })
            let end = Date.now();
    
            let embed = new discord.MessageEmbed()
              .setTitle("Ping!")
              .addField("API Latency", `${Math.round(client.ws.ping)}ms`, true)
              .addField("Message Latency", `${end - start}ms`, true)
              .setColor("RANDOM");
    
           interaction.editReply({embeds: [embed]}).catch((e) => interaction.followUp(e));
    }
}