const play = require('play-dl');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { MessageEmbed } = require('discord.js');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
const queueOutput = require('./queue.js');

const playEmbed = new MessageEmbed()
    .setColor('#00ff2f')
    .addFields(
        {name: 'Acum cant:', value: '<blank>'},
    )
    .setFooter('Work in progress.');

const queueEmbed = new MessageEmbed()
    .setColor('#00ff99')
    .addFields(
        {name: 'Am adaugat:', value: '<blank>'},
    )
    .setFooter('Work in progress.');

const errorEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .addFields(
        {name: 'Nu am putut sa cant melodia:', value: '<blank>'},
    )
    .setFooter('Work in progress.');

const queue = new Map();

var isLooping = false;

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
function timestampGenerator(x){
    if(x > 3600) {
        if((x - 3600) / 60 < 10) return `${round(x / 3600, 0)}:0${round((x - 3600) / 60, 0)}:${x % 60}`;
        else return `${round(x / 3600, 0)}:${round((x - 3600) / 60, 0)}:${x % 60}`;
    }
    else if(x > 60) return `${round(x / 60, 0)}:${x % 60}`;
    else return `0:${x}`;
}

module.exports = {
    name: 'play',
    aliases: ['skip', 's', 'stop', 'queue'],
    description: 'COMANDA | Comanda pentru a reda ceva de pe youtube la bot',
    async execute(message, args, cmd){
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

        const server_queue = queue.get(message.guild.id);

        if(cmd === 'play' || cmd === 'p'){
            if(!args.length) {
                errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'ce drq vrei sa iti cant daca nu ai pus nimic?'};
                return message.reply({embeds: [errorEmbed]});
            }
            let song = {};

            if(ytdl.validateURL(args[0])){
                const song_info = await ytdl.getInfo(args[0]);

                song = {
                    title: song_info.videoDetails.title, 
                    url: song_info.videoDetails.video_url, 
                    author: song_info.videoDetails.ownerChannelName, 
                    timestamp: timestampGenerator(song_info.player_response.videoDetails.lengthSeconds),
                };
            } else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
        
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }
        
                const video = await videoFinder(args.join(' '));

                if(video){
                    song = {title: video.title, url: video.url, author: video.author.name, timestamp: video.timestamp};
                } else {
                    errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'nush ce drq mi-ai dat dar nu am gasit'};
                    message.reply({embeds: [errorEmbed]});
                }
            }

            if(!server_queue){
                const queue_constructor = {
                    voice_channel: voiceChannel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                try {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: guild.id,
                        adapterCreator: guild.voiceAdapterCreator,
                    });
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], message);
                } catch (err){
                    queue.delete(message.guild.id);
                    errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'nu m-am putut conecta'};
                    message.reply({embeds: [errorEmbed]});
                    throw err;
                }
            } else {
                server_queue.songs.push(song);
                queueEmbed.fields[0] = {name: 'Am adaugat:', value: `[${song.title}](${song.url}).\nde **${song.author}** _(${song.timestamp})_`};
                return message.channel.send({embeds: [queueEmbed]});
            }
        }
        else if(cmd === 'loop'){
            if(!isLooping) {
                isLooping = 1;
                queueEmbed.fields[0] = {name: '*Loop:*', value: 'Coada se va repeta.'};
                message.channel.send({embeds: [queueEmbed]});
            } else {
                isLooping = 0;
                queueEmbed.fields[0] = {name: '*Loop:*', value: 'Coada _nu_ se va mai repeta.'};
                message.channel.send({embeds: [queueEmbed]});
            }
        }
        else if(cmd === 'skip' || cmd === 's') {
            skip_song(message, server_queue);
            if(server_queue === undefined){
                errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'nu exista melodii in coada.'};
                return message.reply({embeds: [errorEmbed]});
            } else video_player(message.guild, server_queue.songs[0], message);
        }
        else if(cmd === 'stop') {
            stop_song(message, server_queue);
            if(server_queue === undefined){
                errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'nu exista melodii in coada.'};
                return message.reply({embeds: [errorEmbed]});
            } else video_player(message.guild, server_queue.songs[0], message);
        }
        else if(cmd === 'queue'){
            queueOutput.execute(queue, guild, message);
        }
    }
}

const video_player = async (guild, song, message) => {
    const song_queue = queue.get(guild.id);

    if(!song){
        queue.delete(guild.id);
        song_queue.connection.destroy();
        return;
    }

    let stream = await play.stream(song.url);
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type 
    });
    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    });

    await player.play(resource);
    await song_queue.connection.subscribe(player);
    
    player.on(AudioPlayerStatus.Idle, () => {
        if(isLooping){
            song_queue.songs.push(song_queue.songs[0]);
            song_queue.songs.shift();
        }
        else song_queue.songs.shift();
        video_player(guild, song_queue.songs[0], message);
    });

    player.on('error', error => {
        console.error(error);
        queue.delete(guild.id);
        errorEmbed.fields[0] = {name: 'Nu am putut sa cant melodia:', value: 'eroare necunoscuta.'};
        return message.reply({embeds: [errorEmbed]});
    })
    playEmbed.fields[0] = {name: "Acum cant:", value: `[${song.title}](${song.url})\nde **${song.author}** _(${song.timestamp})_.`};
    await message.channel.send({embeds: [playEmbed]});
}

const skip_song = async (message, server_queue) => {
    if(server_queue) server_queue.songs.shift();
}

const stop_song = async (message, server_queue) => {
    if(server_queue){
        server_queue.songs = [];
        queueEmbed.fields[0] = {name: 'Am iesit din canal.', value: 'muvex'};
        message.channel.send({embeds: [queueEmbed]});
    }
}