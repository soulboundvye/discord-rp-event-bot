const commando = require('discord.js-commando');
const auth = require('./auth.json');

//initialize bot
const bot = new commando.Client();

bot.registry.registerGroup('random','Random');
bot.registry.registerGroup('quantify','Quantify');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.login(auth.token);

