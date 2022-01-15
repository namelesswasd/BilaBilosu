const ytSearch = require('yt-search');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction, ButtonInteraction } = require('discord.js');
const playResult = require('./play');

const searchEmbed = new MessageEmbed()
    .setColor('#00ff99')
    .addFields(
        {name: 'Coada:', value: '<blank>'},
    )
    .setFooter('W.I.P. | Bot-ul poate sa fie instabil.');

const errorEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .addFields(
        {name: 'Nu am putut sa caut:', value: '<blank>'},
    )
    .setFooter('W.I.P. | Bot-ul poate sa fie instabil.');

module.exports = {
    name: 'search',
    description: 'COMANDA | Comanda care cauta rezultate de pe YouTube.',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) {
            errorEmbed.fields[0] = {name: 'Nu am putut sa caut:', value: 'trebuie sa fii pe un canal tambea.'};
            return message.reply({embeds: [errorEmbed]});
        }
        if(!args.length) {
            errorEmbed.fields[0] = {name: 'Nu am putut sa caut:', value: 'ce drq vrei sa iti caut daca nu ai pus nimic?'};
            return message.reply({embeds: [errorEmbed]});
        }

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

        searchEmbed.fields[0] = {name: 'Rezultatele cautarii:', value: "```stylus\n" + search_out + "^  Selecteaza un videoclip.```"};
        message.channel.send({embeds: [searchEmbed]});

        collector.on('collect', msg => {
            if(isNaN(parseInt(msg))) {
                errorEmbed.fields[0] = {name: 'Nu am putut sa caut:', value: 'Nu ai introdus un numar, anulez cautarea...'};
                message.reply({embeds: [errorEmbed]});
            } else {
                const result = videoResult.videos[parseInt(msg) - 1].url;
                playResult.execute(message, [result, ''], 'play');
            }
        });
    }
}