const { MessageEmbed } = require('discord.js');

var c_date = new Date();
var tzdiff = c_date.getTimezoneOffset() * 60000;

const serverAgeEmbed = new MessageEmbed()
    .setColor('#00ff2f')
    .addFields(
        {name: 'Serverul acesta a fost creat pe:', value: '<blank>'},
    )
    .setFooter('W.I.P. | Bot-ul poate sa fie instabil.');

function getCreationDate(id) { return new Date((id / 4194304) + 1420070400000 + tzdiff); }

module.exports = {
    name: 'serverage',
    type: 'command',
    description: 'O comanda care afiseaza cat de vechi este un server',
    execute(message){
        var sv_cr_date = getCreationDate(message.guild.id); 

        var dayoftheweek = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
        var sv_cr_dayoftheweek = dayoftheweek[sv_cr_date.getDay() - 1];
        var sv_cr_day = sv_cr_date.getDate();
        var month = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombire', 'Noembrie', 'Decembrie'];
        var sv_cr_month = month[sv_cr_date.getMonth()];
        var sv_cr_year = sv_cr_date.getFullYear();
        var sv_cr_timestamp = sv_cr_date.toTimeString().slice(0, 8);
        var sv_cr_final = `${sv_cr_dayoftheweek}, ${sv_cr_day} ${sv_cr_month} ${sv_cr_year} @ ${sv_cr_timestamp}`;

        serverAgeEmbed.fields[0] = {name: 'Serverul acesta a fost creat pe:', value: `${sv_cr_final}`};
        return message.reply({embeds: [serverAgeEmbed]});
    }
}