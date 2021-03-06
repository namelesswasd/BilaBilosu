require('dotenv').config();

const {Client, Collection, Intents, MessageEmbed} = require('discord.js');
const embedCreate = require('./functions/embedCreate');

const fs = require('fs');

//const config = require("./config.json");
//const prefix = config.prefix;
const prefix = '//';

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS);

const bot = new Client({ intents: myIntents });

bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

module.exports = bot;

function IntTwoChars(i) {
    return (`0${i}`).slice(-2);
}

let _date = new Date();
let _time = (IntTwoChars(_date.getHours()) + ":" + IntTwoChars(_date.getMinutes()))

var bilaToggle = 0;
var devMode = 0;

//delay function
const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

bot.on('ready', () => {
    bot.user.setStatus('dnd');
    switch(devMode){
        case 0: bot.user.setActivity('from above.', {type: 'WATCHING'}); break;
        case 1: bot.user.setActivity('| MAINTENANCE', {type: 'WATCHING'}); break;
    }
    bot.user.setActivity('from above.', {type: 'WATCHING'});
    
    console.log(`${bot.user.tag} s-a logat.`);
})

//on join
bot.once('guildMemberAdd', member => {
    var channel = member.guild.channels.cache.get('625340754839207955');
    channel.send(`${member.displayName} a intrat pe server.`);
})

//on leave
bot.once('guildMemberRemove', member => {
    var channel = member.guild.channels.cache.get('625340754839207955');
    channel.send(`${member.displayName} a iesit de pe server.`);
})

//COMMANDS
bot.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // actual commands
    if (message.content.startsWith(prefix)){
        const [cmd_name, ...args] = message.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);

        const command = bot.commands.get(cmd_name) || bot.commands.find(a => a.aliases && a.aliases.includes(cmd_name));
        if(command) command.execute(message, args, cmd_name, bot);
        else message.reply({embeds: [embedCreate.execute('error', 'Nu am putut executa comanda:', 'comanda scrisa nu exista.')]});
    } 
})

//REPLIES
bot.on('messageCreate', (message) => {
    if (message.author.bot) return;
    
    if(message.content === 'ping'){ //ping
        bot.commands.get('ping').execute(message, null);
    } else if(message.content === 'Fornetti' || message.content === 'fornetti'){
        bot.commands.get('fornetti').execute(message, null);
    } else if(message.content.toLowerCase().startsWith('bila,')){
        bot.commands.get('8ball').execute(message, null);
    }
})

//LEAGUE FOR MORE THAN 35 MINUTES
/*
bot.on('messageCreate', (message) => {
    if(message.member.presence.activities.name === 'League of Legends' && (Math.round(new Date()).getTime() / 1000 - message.member.presence.activities.timestamps.start === 2100)){
        for(var i = 0; i < 5; i++) message.author.send("IESI DIN LEAGUE IN MOMENTUL ASTA");
    }
})*/

//Bila speaks
bot.on('messageCreate', (message) => {
    if(message.author.bot) return;
    if(message.author.id === "208918353845288960" && bilaToggle === 1){
        message.delete();
        message.channel.send(message.content);
    }
})

//heroku
bot.login(process.env.TOKEN);

//local
//bot.login(config.token);
