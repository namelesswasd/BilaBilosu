const ytSearch = require('yt-search');
const { MessageEmbed, Collection } = require('discord.js');

const searchEmbed = new MessageEmbed()
    .setColor('#00ff2f')
    .addFields(
        {name: 'Am selectat', value: '<blank>'},
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
    description: 'comanda care cauta rezultate de pe YouTube.',
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

        const vids = videoResult.videos.slice(0, 5);
        var vid_nr = 0;
        var search_out = '';
        vids.forEach(function (v) {
            vid_nr++;
            search_out = search_out.concat(`${vid_nr}. [${v.timestamp}] ${v.title}\n`);
        });
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000});
        
        message.channel.send("```stylus\n" + search_out + "^  Selecteaza un videoclip.```");

        collector.on('collect', msg => {
            searchEmbed.fields[0] = {name: "Am cautat:", value: `${videoResult.videos[parseInt(msg) - 1].title}`};
            message.reply({embeds: [searchEmbed]});
        })
    }
}