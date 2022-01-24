const { MessageEmbed, MessageActionRow, MessageButton, Interaction, ButtonInteraction } = require('discord.js');
const playResult = require('./play');
const embedCreate = require('../functions/embedCreate');

module.exports = {
    name: 'search',
    type: 'command',
    description: 'Comanda care cauta rezultate de pe YouTube. (INDISPONIBIL)',
    async execute(message, args){
        return message.reply({embeds: [embedCreate.execute('warn', 'Nu am putut executa comanda:', 'comanda nu este inca diponibila')]});

        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'trebuie sa fii pe un canal tambea.')]});
        if(!args.length) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'ce drq vrei sa iti cant daca nu ai pus nimic?')]});

        const videoResult = await ytSearch(args.join(' '));

        const vids = videoResult.videos.slice(0, 10);
        var vid_nr = 0;
        var search_out = '';
        vids.forEach(function (v) {
            vid_nr++;
            search_out = search_out.concat(`${vid_nr}. [${v.timestamp}] ${v.title}\n`);
        });
        const filter = m => m.author.id === message.author.id;

        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000 }) //collector reply

        message.channel.send({embeds: [embedCreate.execute('success2', 'Rezultatele cautarii:', '```stylus\n' + search_out + '^  Selecteaza un videoclip.```')]});

        collector.on('collect', msg => {
            if(isNaN(parseInt(msg))) {
                message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa caut:', 'nu ai introdus un numar, anulez cautarea.')]});
            } else {
                const result = videoResult.videos[parseInt(msg) - 1].url;
                playResult.execute(message, [result, ''], 'play');
            }
        });
    }
}