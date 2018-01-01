const commando = require('discord.js-commando');

class PollCommand extends commando.Command {
    constructor (client) {
        super(client, {
           name: 'poll',
           group: 'quantify', 
           memberName: 'poll',
           description: 'Creates a poll'
        });
    }

    async run(message, args) {

        message.channel.send("different poll");
    }

}

module.exports = PollCommand;