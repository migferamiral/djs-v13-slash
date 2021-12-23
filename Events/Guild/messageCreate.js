const client = require("../../index")
const { Collection, MessageEmbed } = require("discord.js");

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return;

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author)
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            const NoPerms = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Bu komutu kullanmak için gerekli izinlere sahip değilsiniz!`)
            message.reply({embeds: [NoPerms]}).then((m) => client.sil(m, 5000));
        }
    }

    if (command.disable) {
        return message.reply({ embeds: [new MessageEmbed().setColor(client.ee.error).setDescription(`Bu komut devre dışı olduğundan dolayı kullanılamaz.`)] }).then((m) => client.sil(m, 5000));
    }

    if (command.nodm) {
        if (message.channel.type === "dm") return message.reply({ embeds: [new MessageEmbed().setColor(client.ee.error).setDescription(`Bu komut özel mesajlarda kullanılamaz.`)] }).then((m) => client.sil(m, 5000));
    }

    if (command.developerOnly) {
         if(message.author.id !== client.config.developerID) return message.delete(), message.reply({ embeds: [new MessageEmbed().setColor(client.ee.error).setDescription(`Bu komutu sadece \`Geliştirici\` kullanabilir.`)] }).then((m) => client.sil(m, 5000));
    }
        
    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const timeLeftEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Bu komutu tekrar kullanmak için \`${timeLeft.toFixed(1)}\` saniye beklemelisin!`)
            return message.channel.send({embeds: [timeLeftEmbed]}).then((m) => client.sil(m, 2500));
        };
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.log(error);
        const ErrorLogs = client.channels.cache.get("844188330215342080");
        const ErrorEmbed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Bir hata oluştu.`)
        message.channel.send({embeds: [ErrorEmbed]});
        ErrorLogs.send("Bir komutda hata oluştu! Hata:", err)
        }
});