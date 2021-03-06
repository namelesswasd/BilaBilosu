const { MessageEmbed } = require('discord.js');
const embedCreate = require('../functions/embedCreate');

var c_date = new Date();
var tzdiff = c_date.getTimezoneOffset() * 60000;

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

        return message.reply({embeds: [embedCreate.execute('success2', 'Serverul acesta a fost creat pe:', `${sv_cr_final}`)]});
    }
}