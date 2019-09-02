module.exports = {
    execute(msg, bot){

        let channel = bot.guilds.get('612515458767388698').channels.get('615734083678371841');
        if(msg.channel.id === "478074557232578561"){
            channel.send(`=====================================
${msg.content} 
            
from ${msg.author.user}`);
        }
    }
}