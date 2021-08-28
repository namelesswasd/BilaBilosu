module.exports = {
    name: 'musicWrongChannel',
    description: 'cand un tembel uita sa scrie o comanda de muzica pe chat-ul corect',
    execute(message, args){
        message.author.send("Scrie in pula mea pe #muzica.");
        message.delete();
    }
}