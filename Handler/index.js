const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const globPromise = promisify(glob);

module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
    eventFiles.map((value) => require(value));

    
    // Slash
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file.name) return;
        client.slashCommands.set(file.name, file);
        arrayOfSlashCommands.push(file);
    });
    
    client.on("ready", async () => {
         const CLIENT_ID = client.user.id;
         const GUILD_ID = "823286929688625172"
         const rest = new REST({ version: '9' }).setToken(client.config.token);

         (async () => {
             try {
                 console.log('Started refreshing application (/) commands.');
         
                 await rest.put(
                     Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                     { body: arrayOfSlashCommands },
                 );
         
                 console.log('Successfully reloaded application (/) commands.');
             } catch (error) {
                 console.error(error);
             }
         })();
    });

    if (!client.config.mongourl) return;
    mongoose
        .connect(client.config.mongourl)
        .then(() => console.log("Connected to mongodb"));
};