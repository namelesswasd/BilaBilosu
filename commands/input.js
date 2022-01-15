module.exports = {
    name: 'input',
    description: 'COMANDA | Folosit in ARG-uri',
    execute(message, args){
        if(!args[0]){
            message.reply("te rog pune un raspuns.")
        } else {
            if(args[0] === "corocotochiste"){
                message.reply("https://imgur.com/a/Lx5WF6K");
            } else {
                message.reply(":x:");
            }
        }
    }
}