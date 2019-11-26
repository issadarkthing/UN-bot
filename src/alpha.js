const Discord =  require('discord.js');


module.exports = {

  execute(msg, args){

        const validUsers = ["292019603544997888", "478042194322915329", "264010327023288323", "378745839947874304"];

        const config = { serverId: "388892644929175552"}

        if(!validUsers.includes(msg.author.id)) return;

        const server = msg.client.guilds.get(config.serverId);

        const channel = server.channels.find(c => c.id === "478206001544429569");

        const emoji = server.emojis.find(e => e.name === "boosting") || "";
        const gbEmoji = server.emojis.find(e => e.id === "479631989335654430") || "";
        const HCEmoji = server.emojis.find(e => e.id === "606919195279491118") || "";
        const nitroEmoji = server.emojis.find(e => e.id === "616293973484371988") || "";
        const everyone = server.defaultRole;

    

            const member = server.members.get(args[1]);
            
            const embed = new Discord.RichEmbed()
            .setColor('3232FF')
            .setThumbnail(member.user.avatarURL)
            .addField(`${nitroEmoji} 🎉 ${member.displayName} just boosted the server! 🎉`, `
Thank you for contributing, you will receive your own unique emoji, updated nickname, 50c ${gbEmoji} and 31 days of HC ${HCEmoji}`);
            channel.send(`**Announcement** ${everyone}`);
            channel.send(embed)
            .then(m => m.react('😱')
            .then(() => m.react('❤'))
            .then(() => m.react('😍'))
            .then(() => m.react('🔥'))
            .then(() => m.react('🍌'))
            .then(() => m.react(emoji || "👍")))


  }
}