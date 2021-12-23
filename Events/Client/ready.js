const client = require("../../index")
const figlet = require('figlet');

client.on("ready", () => {
    figlet(client.user.tag, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
    });
    client.user.setPresence({
        status: client.config.status,
        activity: {
            name: client.config.text,
            type: client.config.type
        }
    })
});