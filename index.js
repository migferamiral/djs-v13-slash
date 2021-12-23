const { Client, Collection } = require("discord.js");

const client = global.client = new Client({ 
    intents: 32767
  });
  
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.config = require("./Reference/Config");
client.system = require("./Reference/System");

// Initializing the project
require("./handler")(client);

client.sil = function(msg, ms) {
    setTimeout(() => msg.delete().catch(() => {}), ms);
};

client.login(client.config.token).catch(err => console.error("[DISCORD API] Token doğrulanamadı. Tokeni yenileyip tekrar deneyiniz."));