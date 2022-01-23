const { MessageEmbed, MessageActionRow, MessageButton, Interaction, ButtonInteraction } = require('discord.js');
const embedCreate = require('../functions/embedCreate');

module.exports = {
    execute(queue, guild, message){
        var song_nr = 0;
        var queue_out = '';
        if(!queue.get(guild.id)){
            return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa execut comanda: ', 'Nu exista nimic in coada.')]});   
        }
        const song_queue = queue.get(guild.id).songs;
        song_queue.forEach(function (v) {
            song_nr++;
            queue_out = queue_out.concat(`${song_nr}. ${v.title} (${v.timestamp})\n`);
        })

        message.channel.send({embeds: [embedCreate.execute('success1', 'Coada: ', '```stylus\nv  Aici esti tu.\n' + queue_out + '```')]});
    }
}