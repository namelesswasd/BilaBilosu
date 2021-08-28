//collatz
const colarr = [];
var colnum = 0;
var colpos = 0;
var colhigh = 0;

module.exports = {
    name: 'collatz',
    description: 'un algoritm misto',
    execute(message, args){
        if(!args[0]){
            message.reply("te rog pune un numar.")
        } else if(args[0] < 0){
            message.reply("te rog pune un numar pozitiv.")
        } else {
            colhigh = 0;
            colnum = args[0];
            colpos = 0;
            colarr.splice(0, colarr.length);
            while(colnum !== 1){
                colarr[colpos] = colnum;

                if(colhigh < colnum) colhigh = colnum;

                if(colnum % 2 === 0) colnum /= 2; 
                else colnum = colnum * 3 + 1;
                colpos++;
            }
            message.reply("```yaml\nConjuctura Collatz / problema 3n+1 este o problema care nu a fost rezolvata in matematica.\nPorneste de la orice numar intreg pozitiv, daca numarul este par, imparte la 2, altfel, inmulteste cu 3 si aduna 1, orice numar ales va ajunge eventual la 1.\nSecventa ta de numere a fost: \n" + colarr + ", -1-.``````yaml\nCel mai mare numar din secventa a fost: " + colhigh + "\nCati pasi s-au parcurs pana la '1': " + colpos + "```");
        }
    }
}