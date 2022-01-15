module.exports = {
    name: '8ball',
    description: 'RASPUNS | Bila iti citeste in palma (se executa cu \"Bila, \" la inceput.)',
    execute(message, args){
        var answers = ['da', 'nu', 'nu stiu', 'cu siguranta', 'in niciun caz', 'vei vedea in curand', 'imposibil', 'garantat', 'intreab-o pe ma-ta', 'n-are cum', 'nu cred', 'nuu creeeed', 'la haz', 'ca idee', 'ce pula mea'];
        var choice = Math.floor(Math.random() * (answers.length));
        message.reply(answers[choice]);
    }
}