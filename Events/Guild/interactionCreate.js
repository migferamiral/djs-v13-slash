const client = require("../../index")
const { Collection, MessageEmbed } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const command = client.slashCommands.get(interaction.commandName);
    if(!command) return interaction.reply({content: 'Komutda bir hata oluştu çözülmesi için \`Geliştirici\` ile iletişime geçin!', ephemeral: true});

    if(command.developerOnly) {
        if (!interaction.member.user.id == client.config.developerID) {
            return interaction.reply({content: `Bu komutu sadece \`Geliştirici\` kullanabilir.`, ephemeral: true})
        }
    }

    const args = [];

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)){
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime){
            const timeLeft = (expirationTime - now) / 1000;
            return interaction.reply({ content: `\`${command.name}\` isimli komutu tekrar kullanmak için \`${timeLeft.toFixed(1)}\` (s)aniye bekleyiniz.`, ephemeral: true })
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    for (let option of interaction.options.data) {
        if (option.type === 'SUB_COMMAND') {
            if (option.name) args.push(option.name);
            option.options?.forEach(x =>  {
                if (x.value) args.push(x.value);
            });
        } else if (option.value) args.push(option.value);
    }

    try {

        command.execute(client, interaction, args)
    } catch (e) {
        interaction.reply({content: e.message, ephemeral: true});
    }

});