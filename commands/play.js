const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'play',
    description: 'Comanda pentru a reda ceva de pe youtube la bot',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.reply('trebuie sa fii pe un canal tambea.');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.reply('tu nu ai voie boss');
        if(!args.length) return message.reply('ce drq vrei sa iti cant daca nu ai pus nimic?');

        const connection = await voiceChannel.join();

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));

        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                voiceChannel.leave();
            });

            await message.reply(`cant **${video.title}**`)
        } else message.reply('nush ce drq mi-ai dat dar nu am gasit');
    }
}