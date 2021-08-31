const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { MessageEmbed } = require('discord.js');
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require('@discordjs/voice');
const { channel } = require('diagnostics_channel');

const playEmbed = new MessageEmbed()
    .setColor('#00ff2f')
    .addFields(
        {name: 'Acum cant:', value: '<blank>'},
    )
    .setFooter('W.I.P. | Bot-ul poate sa fie instabil.');

const errorEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .addFields(
        {name: 'Nu am putut sa cant melodia:', value: '<blank>'},
    )
    .setFooter('W.I.P. | Bot-ul poate sa fie instabil.');

module.exports = {
    name: 'play',
    description: 'Comanda pentru a reda ceva de pe youtube la bot',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;
        const guild = message.guild;

        if(!voiceChannel) {
            errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'trebuie sa fii pe un canal tambea.'};
            return message.reply({embeds: [errorEmbed]});
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'tu nu ai voie boss.\n_(permisiuni insuficiente)_'};
            return message.reply({embeds: [errorEmbed]});
        }
        if(!args.length) {
            errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'ce drq vrei sa iti cant daca nu ai pus nimic?'};
            return message.reply({embeds: [errorEmbed]});
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));

        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'});
            const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
            const player = createAudioPlayer();

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => connection.destroy());

            playEmbed.fields[0] = {name: "Acum cant:", value: video.title};
            await message.reply({embeds: [playEmbed]});
        } else message.reply('nush ce drq mi-ai dat dar nu am gasit');
    }
}