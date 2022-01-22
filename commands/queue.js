const { MessageEmbed, MessageActionRow, MessageButton, Interaction, ButtonInteraction } = require('discord.js');

const queueEmbed = new MessageEmbed()
    .setColor('#00ff2f')
    .addFields(
        {name: 'Coada:', value: '<blank>'},
    )
    .setFooter('W.I.P. | Bot-ul poate sa fie instabil.');

module.exports = {
    name: 'queue',
    type: 'command',
    description: 'O comanda care arata ce este in coada (muzica)',
    execute(queue, guild, message){
        var song_nr = 0;
        var queue_out = '';
        const song_queue = queue.get(guild.id).songs;
        song_queue.forEach(function (v) {
            song_nr++;
            queue_out = queue_out.concat(`${song_nr}. ${v.title} (${v.timestamp})\n`);
        })

        queueEmbed.fields[0] = {name: 'Coada:', value: "```stylus\nv  Aici esti tu.\n" + queue_out + "```"}
        message.channel.send({embeds: [queueEmbed]});
    }
}