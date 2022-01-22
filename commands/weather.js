const PORT = 8000;

const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const errEmbed = new MessageEmbed()
    .setTitle('Nu am putut executa comanda.')
    .setDescription('<blank>')

module.exports = {
    name: 'weather',
    type: 'command',
    description: 'Comanda pentru a arata vremea din Romania',
    execute(message, args){
        if(!args[0] || !args[1]){
            errEmbed.title = 'Nu am putut executa comanda:';
            errEmbed.description = 'Introduce un judet si o localitate.';
            message.reply({embeds: [errEmbed]});
            return;
        }

        if(args[2]) args[1] = args[1] + '-' + args[2];

        args[0] = args[0].toLowerCase();
        args[1] = args[1].toLowerCase();

        const url = `https://www.worldweatheronline.com/${args[1]}-weather/${args[0]}/ro.aspx`;

        axios(url)
        .then(response => {
            const html = response.data;
            //console.log(html);
            const $ = cheerio.load(html);
            const weather_data = [];
            if($('title').text().trim() === 'Romania Weather | WorldWeatherOnline.com'){
                errEmbed.title = 'Nu am putut executa comanda:';
                errEmbed.description = 'Nu am gasit locatia precizata\n_(Comanda accepta numai locatii din Romania momentan.)_';
                message.reply({embeds: [errEmbed]});
                return;
            } else {
                $('.weather-summary', html).each(function() {
                    const location = `${capFirstLetter(args[0])}, ${capFirstLetter(args[1]).split('-').join(' ')}`;
                    var mood = $(this).find('.weather-widget-icon').find('p').text().trim();
                    if(mood === 'Sunny') mood = 'Clear';
                    const temp = $(this).find('.weather-widget-temperature').find('p').text().trim().substring(0, 1).concat('°c');
                    const feels_len = $(this).find('.weather-widget-temperature').find('.feels').text().length;
                    const feels = $(this).find('.weather-widget-temperature').find('.feels').text().split(' ').join('').substring(6, feels_len);
                    const wind = $(this).find('.wind-speed').text();
                    const wind_dir = $(this).find('.wind').text();
                    const add_data = $(this).find('.ws-details-item').nextAll().find('span').text().split(' ').join('').trim().split('\n');
                    const rain = add_data[0];
                    const cloud = add_data[1];
                    const humidity = add_data[2];
                    weather_data.push({
                        location,
                        mood,
                        temp,
                        feels,
                        wind,
                        wind_dir,
                        rain,
                        cloud,
                        humidity
                    });
                    console.log(weather_data);
                    const weatherEmbed = new MessageEmbed()
                        .setTitle(`Weather in ${weather_data.map(x => x.location)}`)
                        .addFields(
                            { name: 'Mood: ', value: `${weather_data.map(x => x.mood)}` },
                            { name: 'Temperature: ', value: `${weather_data.map(x => x.temp)} _(feels like ${weather_data.map(x => x.feels)})_` },
                            { name: 'Wind: ', value: `${weather_data.map(x => x.wind)} ${weather_data.map(x => x.wind_dir)}` },
                            { name: 'Rain: ', value: `${weather_data.map(x => x.rain)}`, inline: true },
                            { name: 'Cloud: ', value: `${weather_data.map(x => x.cloud)}`, inline: true },
                            { name: 'Humidity: ', value: `${weather_data.map(x => x.humidity)}`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter(`Data taken from worldweatheronline.com.`)
                    message.reply({embeds: [weatherEmbed]})
                });
            }
            }).catch(err => console.log(err));
        }
    }


app.listen(PORT, () => console.log(`WEATHER: ruleaza pe port-ul ${PORT}`));