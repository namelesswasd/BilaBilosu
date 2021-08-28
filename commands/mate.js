module.exports = {
    name: 'mate',
    description: 'bila face matematica',
    execute(message, args){
        var _x = args[0];
            var _y = args[2];
            var _result;
            if(!args[1]){
                message.channel.send("_:warning: pune ba spatii intre operatii frizer nenorocit_");
            } else if (args[3]) {
                message.reply("mai mult nu stiu");
            } else {
                switch (args[1]){
                    case "+": //adunare
                        _result = _x + _y;
                        message.reply(`${_result}`);
                        break;
                    case "-": //scadere
                        if(((_x % 10) <= (_y % 10)) || _x.length > 2 || _y.length > 2){
                            var choice = Math.floor(Math.random() * 4) + 1;
                            switch (choice){
                                case 1:
                                    message.reply("hai ma nu mai fa misto");
                                    break;
                                case 2:
                                    message.reply("baa**aaAAA** gAtA");
                                    break;
                                case 3:
                                    message.reply("hai ma lasama");
                                    break;
                                case 4:
                                    message.reply("tuz fata aia de frizer **GATAAAA**");
                            }
                        } else {
                            _result = _x - _y;
                            message.reply(`${_result}`);
                        }
                        break;
                    case "*": //inmultire
                        message.reply(`ce baliverne vorbesti ma`);
                        break;
                    case "/": //impartire /
                        message.reply(`lasama cas schimbu 3`);
                        break;
                    case ":": //impartire :
                        message.reply(`lasama cas schimbu 3`);
                        break;
                }
            }
    }
}