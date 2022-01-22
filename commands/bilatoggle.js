let bilaToggle = 0;

module.exports = {
    name: 'bilatoggle',
    type: 'command',
    description: 'Bila vorbeste in locul owner-ului.',
    execute(message, bot){
        if(!bilaToggle){
            bilaToggle = 1;
            message.channel.send("Bila mode **ON**.");
        } else {
            bilaToggle = 1;
            message.channel.send("Bila mode **OFF**.");
        }
        bot.on('message', (message) => {
            if(message.author.bot) return;
            if(message.author.id === "208918353845288960" && bilaToggle === 1){
                message.delete();
                message.channel.send(message.content);
            }
        })
    }
}