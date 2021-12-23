const { MessageEmbed } = require('discord.js');
const moment = require("moment");

module.exports = {
    name: "test",
    cooldown: 5,
    async execute(client, message, args){
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
            return message.reply({content: `${invite.code}`});
        });
    }
}