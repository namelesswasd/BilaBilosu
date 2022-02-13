const embedCreate = require('../functions/embedCreate')

module.exports = {
    name: 'cryptogram',
    aliases: ['crypt'],
    type: 'command',
    description: 'O comanda care codeaza si decodeaza mesaje.',
    execute(message, args){
        if(!args[0]) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut executa comanda:', 'Te rog introduce un mod de criptare\n```        v\n//crypt <mode> <encode/decode> <text>```\nFoloseste ```//crypt help``` pentru a afla mai multe.')]});
        if(args[0] == 'help') return message.reply({embeds: [embedCreate.execute('warn', 'Moduri de criptare disponibile:', '_Click pe mod pentru a afla mai multe despre el._\n- [polybius](https://en.wikipedia.org/wiki/Polybius_square)')]});
        if(!args[1] || !(args[1] === 'encode' || args[1] === 'decode')) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut executa comanda:', 'Te rog introduce encode / decode\n```               v\n//crypt <mode> <encode/decode> <text>```')]});
        if(!args[2]) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut executa comanda:', 'Te rog introduce text pentru a cripta / decripta.\n```                               v\n//crypt <mode> <encode/decode> <text>```')]});
        
        switch(args[0]){
            case 'polybius': 
                if(args[1] === 'encode') return message.reply({embeds: [embedCreate.execute('success1', 'Mesaj codificat!', `${textToPolybius(args.slice(2).join(' '))}`)]});
                else return message.reply({embeds: [embedCreate.execute('warn', 'Nu am putut decodifica mesajul:', `_soon(TM)_`)]});
            break;

            default: return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut executa comanda:', 'Modul acesta de criptare nu este disponibil.')]});
        }
    }
}

function textToPolybius(text){
    var index = 0, res = 0, coded = '';
    for(var i = 0; i < text.length; i++){
        index = text.charCodeAt(i);
        
        if(index >= 65 && index <= 90) index -= 64; //uppercase
        else if(index >= 97 && index <= 122) index -= 96; //lowercase
        else {
            coded = coded.concat(text.charAt(i));
            index = -1;
        }
        
        if(index === 10) index--; //j == i

        res = Math.ceil(index / 5) * 10 + index % 6;
        if(index >= 0) coded = coded.concat(res.toString());
    }
    return coded;
}