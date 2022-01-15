const fs = require('fs');
const { MessageEmbed } = require('discord.js'); 

module.exports = {
    name: 'help',
    description: 'COMANDA | O comanda care afiseaza toate comenzile bot-ului',
    execute(message, args){
        fs.readdir('./commands/', (err, files) => {
            if(err) console.log(err);
            let jsfiles = files.filter(f => f.split('.').pop() === "js");
            if(!jsfiles.length) {
                console.log("Nu am incarcat nici o comanda.");
                return;
            }

            var help_arr = [];

            var namelist = ''; var desclist = '';

            let result = jsfiles.forEach((f, i) => {
                let props = require(`./${f}`);
                namelist = props.name;
                desclist = props.description;

                help_arr.push(`\n\n${namelist}: \n${desclist}`);
            });
            message.author.send('```PREFIX-UL ESTE //\n(COMENZILE folosesc prefixul, iar RASPUNSURILE nu.)' + help_arr + '```');
        });
    }
}