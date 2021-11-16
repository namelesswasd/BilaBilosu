require('dotenv').config();

const {Client, Collection, Intents, MessageEmbed} = require('discord.js');

const fs = require('fs');
//const config = require("./config.json");

const prefix = '//';
//const prefix = config.prefix;

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS)

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
bot.once('guildMemberAdd', async member => {
    if(member.user.bot) member.kick();

    if(member.user.id === "303551762915262466"){
        member.send("𝕭𝖆𝖘𝖙𝖆 𝖉𝖊 𝖆𝖎𝖈𝖎 :smiling_face_with_3_hearts:").catch();
        await delay(1000);
        member.kick();
    }
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

        //Bila speaks for nlx toggle
        if (cmd_name === "bilaToggle"){ //vb eu in locul botului
            if(bilaToggle === 0){
                bilaToggle = 1;
                message.channel.send("Bila mode **ON**.");
            } else if (bilaToggle === 1){
                bilaToggle = 0;
                message.channel.send("Bila mode **OFF**.")
            }
        }

        if(cmd_name === "devMode"){
            if(devMode === 0){
                devMode = 1;
                bot.user.setActivity('| MAINTENANCE', {type: 'WATCHING'});
                message.channel.send("Developer mode **ON**.");
            } else if (devMode === 1){
                devMode = 0;
                bot.user.setActivity('from above.', {type: 'WATCHING'});
                message.channel.send("Developer mode **OFF**.");
            }
        }

        //command handler
        if((cmd_name && !devMode) || (cmd_name && devMode && message.channel.id === "842493326065139762")){
            if(cmd_name === "answer"){
                bot.commands.get('answer').execute(message, args);   
            } else if(cmd_name === "collatz"){
                bot.commands.get('collatz').execute(message, args);
            } else if(cmd_name === "input"){
                bot.commands.get('input').execute(message, args);
            } else if(cmd_name === "bulkdelete"){
                bot.commands.get('bulkdelete').execute(message, args);
            } else if(cmd_name === "mate"){
                bot.commands.get('mate').execute(message, args);
            } else if(cmd_name === "play" || cmd_name === "p" || cmd_name === "skip" || cmd_name === "s" || cmd_name === "stop" || cmd_name === "queue"){
                bot.commands.get('play').execute(message, args, cmd_name);
            } else if(cmd_name === "search"){
                bot.commands.get('search').execute(message, args);
            } else if(cmd_name === "serverage"){
                bot.commands.get('serverage').execute(message);
            }
        } else {
            message.reply({embeds: [devEmbed]});
        }
    }
})

//REPLIES
bot.on('message', (message) => {
    if (message.author.bot) return;
    
    if(message.content === 'ping'){ //ping
        bot.commands.get('ping').execute(message, null);
    } else if(message.content === 'Fornetti' || message.content === 'fornetti'){
        bot.commands.get('fornetti').execute(message, null);
    } else if(message.content.startsWith("-p") || message.content.startsWith("-play") || message.content.startsWith("-search")){
        if(message.channel.id !== "648219216456974336"){
            bot.commands.get('musicWrongChannel').execute(message, null);
        }
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

bot.login(process.env.TOKEN);
//bot.login(config.token);

//303551762915262466 costi id