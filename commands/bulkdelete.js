module.exports = {
    name: 'bulkdelete',
    description: 'COMANDA | O comanda pentru a sterge mai multe mesaje',
    execute(message, args){
        if(message.author.id === "208918353845288960"){
            if(!args[0]){
                message.channel.send("pune ma un numar wtf.")
            } else if (args[0] > 100){
                message.channel.send("prea mult.")
            } else if (args[0] < 1){
                message.channel.send("prea putin.")
            } else {
                message.channel.bulkDelete(args[0]).then(() => {
                    message.channel.send(`Am sters ${args[0]} (de) mesaje.`).then(msg => msg.delete({ timeout: 3000 })).catch();
                });
            }
        } else message.reply("tu nu poti fraiere.")
    }
}