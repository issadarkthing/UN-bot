const UNserver = require('../model');
const Discord = require('discord.js');
module.exports = {

    async execute(oldMember, newMember){
    var channelID;
    let guildID = await newMember.guild.id;

    UNserver.findOne({ id: guildID }, (err, res) => {

        if(err) return console.log(err);
        if(!res) return;
        if(res.boost_channel){
            channelID = res.boost_channel; 
        }else{
            return 
        }
        
    })
    .then(() => {
        let channel = newMember.guild.channels.find(c => c.id === channelID);

        const emoji = channel.guild.emojis.find(e => e.name === "boosting");
        const gbEmoji = channel.guild.emojis.find(e => e.id === "479631989335654430");
        const HCEmoji = channel.guild.emojis.find(e => e.id === "606919195279491118");
        const nitroEmoji = channel.guild.emojis.find(e => e.id === "616293973484371988");
        const everyone = channel.guild.defaultRole;

    
        if(oldMember.roles.has('593354032005775373') === false && newMember.roles.has('593354032005775373') === true){ //change this later
            const member = newMember.user;
            
            const embed = new Discord.RichEmbed()
            .setColor('3232FF')
            .setThumbnail(member.avatarURL)
            .addField(`${nitroEmoji} 🎉 ${newMember.displayName} just boosted the server! 🎉`, `
Thank you for contributing, you will receive your own unique emoji, updated nickname, 50c ${gbEmoji} and 31 days of HC ${HCEmoji}`);
            channel.send(`**Announcement** ${everyone}`);
            channel.send(embed)
            .then(m => m.react('😱')
            .then(() => m.react('❤'))
            .then(() => m.react('😍'))
            .then(() => m.react('🔥'))
            .then(() => m.react('🍌'))
            .then(() => m.react(emoji)))

        }
    })
    .catch(err => console.log(err))

    

    }
}