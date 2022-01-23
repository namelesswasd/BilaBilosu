const fs = require('fs');
const { MessageEmbed } = require('discord.js'); 
const embedCreate = require('../functions/embedCreate');

module.exports = {
    name: 'help',
    type: 'command',
    description: 'O comanda care afiseaza toate comenzile bot-ului',
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
                typelist = props.type;
                switch(typelist){
                    case 'command': typelist = 'COMANDA'; break;
                    case 'response': typelist = 'RASPUNS'; break;
                }
                desclist = props.description;

                if(namelist) help_arr.push(`\n\n${namelist}: \n${typelist} | ${desclist}`);
            });

            message.author.send({embeds: [embedCreate.execute('success1', 'Ajutor:', '```PREFIX-UL ESTE //\n(COMENZILE folosesc prefixul, iar RASPUNSURILE nu.)' + help_arr + '```')]});
        });
    }
}