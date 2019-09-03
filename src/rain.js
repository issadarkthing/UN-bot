module.exports = {
    execute(msg, bot){

        let channel = bot.guilds.get('612515458767388698').channels.get('615734083678371841');
        let name = msg.guild.members.find(m => m.id === msg.author.id).displayName;
        var img = [];
        if(msg.channel.id === "478074557232578561"){
            if(msg.attachments.size > 0){
                msg.attachments.forEach(el => {
                    img.push(`${el.url} \n\`${el.message}\``);
                })
            }
            channel.send(`
${msg.content} 
${img.join("")}
            
from \`${name}\`
==========================================`);
        }
    }
}