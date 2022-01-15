module.exports = {
    name: 'answer',
    description: 'COMANDA | Folosit in ARG-uri',
    execute(message, args){
        if(!args[0]){
            message.reply("te rog pune un raspuns.")
        } else {
            if(args[0] === "synergistic"){
                message.reply(":white_check_mark:");
            } else if (args[0] === "sugipularadu"){
                message.reply("ce a zis el")
            } else {
                message.reply(":x:");
            }
        }
    }
}