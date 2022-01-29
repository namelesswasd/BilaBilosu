const play = require('play-dl');
const { MessageEmbed } = require('discord.js');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
const queueOutput = require('./queue.js');
const embedCreate = require('../functions/embedCreate');

const queue = new Map();

var isLooping = false;

module.exports = {
    name: 'play',
    type: 'command',
    aliases: ['p', 'skip', 'stop', 'queue', 'loop'],
    description: 'Comanda pentru a reda ceva de pe youtube la bot',
    async execute(message, args, cmd){

        const voiceChannel = message.member.voice.channel;
        const guild = message.guild;

        if(!voiceChannel) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'trebuie sa fii pe un canal tambea.')]});
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'tu nu ai voie boss.\n_(permisiuni insuficiente)_')]});
       
        const server_queue = queue.get(message.guild.id);

        if(cmd === 'play' || cmd === 'p'){
            if(!args.length) return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'ce drq vrei sa iti cant daca nu ai pus nimic?')]});
            
            let song = {};

            console.log(play.validate(args[0]));

            if(play.yt_validate(args[0]) === 'playlist') return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia', 'Bila nu cunoaste link-ul aceasta momentan.')]});

            let video = await play.search(args.join(' '), {limit: 1});

            if(video){
                song = {
                    title: video[0].title,
                    url: video[0].url,
                    author: video[0].channel.name,
                    timestamp: video[0].durationRaw
                }
            } else return message.reply({embeds: [embedCreate.execute('error', 'Nu am gasit melodia', 'nush ce drq mi-ai dat dar nu am gasit.')]})

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
                        adapterCreator: guild.voiceAdapterCreator
                    });
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], message);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'nu m-am putut conecta')]});
                    throw err;
                }
            } else {
                server_queue.songs.push(song);
                return message.channel.send({embeds: [embedCreate.execute('success2', 'Am adaugat:', `[${song.title}](${song.url}).\nde **${song.author}** _(${song.timestamp})_`)]});
            }
        } else if(cmd === 'loop'){
            console.log("PLAY | User used loop command.");
            if(!isLooping) {
                isLooping = 1;
                message.channel.send({embeds: [embedCreate.execute('success2', 'Loop:', 'Coada se va repeta.')]});
            } else {
                isLooping = 0;
                message.channel.send({embeds: [embedCreate.execute('success2', 'Loop:', 'Coada **nu** se va mai repeta.')]});
            }
        } else if(cmd === 'skip') {
            console.log("PLAY | User skipped song.");
            skip_song(message, server_queue);
            if(server_queue === undefined){
                return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'nu exista melodii in coada.')]});
            } else video_player(message.guild, server_queue.songs[0], message);
        } else if(cmd === 'stop') {
            console.log("PLAY | User stopped the songs.");
            stop_song(message, server_queue);
            if(server_queue === undefined){
                return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'nu exista melodii in coada.')]});
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

    let msg = await message.channel.send({embeds: [embedCreate.execute('success1', 'Acum cant:', `[${song.title}](${song.url})\nde **${song.author}** _(${song.timestamp})_.`)]});
    console.log(`PLAY | Now playing [${song.title}](${song.url})\nde **${song.author}** _(${song.timestamp})_.`);
    player.on(AudioPlayerStatus.Idle, () => {
        msg.delete();
        if(isLooping){
            console.log("PLAY | Looped to the next song.");
            song_queue.songs.push(song_queue.songs[0]);
            song_queue.songs.shift();
        } else {
            console.log("PLAY | Skipped to the next song.");
            song_queue.songs.shift();
        }

        video_player(guild, song_queue.songs[0], message);
    })

    player.on('error', error => {
        console.error(error);
        queue.delete(guild.id);
        return message.reply({embeds: [embedCreate.execute('error', 'Nu am putut sa cant melodia:', 'eroare necunoscuta.')]});
    })
}

const skip_song = async (message, server_queue) => {
    if(server_queue) server_queue.songs.shift();
}

const stop_song = async (message, server_queue) => {
    if(server_queue){
        server_queue.songs = [];
        message.channel.send({embeds: [embedCreate.execute('success2', 'Am iesit din canal.', 'muvex')]});
    }
}