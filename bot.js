require('dotenv').config();

const {Client, Collection, Intents, MessageEmbed} = require('discord.js');

const fs = require('fs');
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

const devEmbed = new MessageEmbed()
    .setColor('#ffd500')
    .addFields(
        {name: "Nu am putut executa comanda!", value: "Bot-ul este in mentenanta."},
    )

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
bot.on('message', (message) => {
    if (message.author.bot) return;
    
    //logging function

    const channelMessage = bot.channels.cache.find(channel => channel.name === "messages");
    const channelMisc = bot.channels.cache.find(channel => channel.name === "miscellaneous");

    function log(type){
        switch (type){
            case "mess": //message
                channelMessage.send(`**${message.author.tag}** *(${message.channel.name})* @ *${_time}* \n> ${message.content}`);
            break;

            case "misc": //misc
                //soonTM
            break;
        }
    }

    log("mess");

    // actual commands
    if (message.content.startsWith(prefix)){
        const [cmd_name, ...args] = message.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);

        const command = bot.commands.get(cmd_name) || bot.commands.find(a => a.aliases && a.aliases.includes(cmd_name));
        if(command) command.execute(message, args, cmd_name, bot);
    }

        
})

//REPLIES
bot.on('message', (message) => {
    if (message.author.bot) return;
    
    if(message.content === 'ping'){ //ping
        bot.commands.get('ping').execute(message, null);
    } else if(message.content === 'Fornetti' || message.content === 'fornetti'){
        bot.commands.get('fornetti').execute(message, null);
    } else if(message.content.toLowerCase().startsWith('bila,')){
        bot.commands.get('8ball').execute(message, null);
    }
})

//Bila speaks
bot.on('message', (message) => {
    if(message.author.bot) return;
    if(message.author.id === "208918353845288960" && bilaToggle === 1){
        message.delete();
        message.channel.send(message.content);
    }
})

//bot.login(process.env.TOKEN);

const config = require("./config.json");
bot.login(config.token);
