const { MessageEmbed } = require('discord.js');
module.exports = {
    execute(_color, _name, _value){
        switch(_color){
            case 'error': _color = '#cf0000'; break;
            case 'warn': _color = '#cf9700'; break;
            case 'success1': _color = '#11cf00'; break;
            case 'success2': _color = '#00cf78'; break;
            default: break;
        }

        var embed = new MessageEmbed()
            .setColor(_color)
            .addFields(
                {name: `${_name}`, value: `${_value}`},
            )
            .setFooter('Work in progress.');

        return embed;
    }
}