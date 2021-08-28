module.exports = {
    name: 'ping',
    description: 'Comanda de ping',
    execute(message, args){
        var choice = Math.floor(Math.random() * 4) + 1;
        switch (choice){
            case 1:
                message.reply("pong in bila mea");
                break;
            case 2:
                message.reply("te bag in pong-ul ma-tii");
                break;
            case 3:
                message.reply("nu ma mai suna ca sunt schimbul 3...   pong");
                break;
            case 4:
                message.reply("sa nu mai pong");
                break;
            case 5:
                message.reply("pong");
                break;
        }
    }
}