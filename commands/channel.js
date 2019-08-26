const mongoose = require('mongoose');
const UNserver = require('../model');

module.exports = {
    name : 'channel',
    description : 'changes the prefix',
    execute(msg, args){
        let member = msg.guild.members.find(m => m.id === msg.author.id);
        
        // let verifiedRole = msg.guild.roles.find(m => m.id === "478203252127694864")  //change this later
        
        // if(!member.roles.has(verifiedRole.id)) return msg.reply('Only three people can use this command');

        if(!args[1]) return msg.channel.send(`You need to specify which channel you want to use. 
Example \`$channel #channel\``);

        UNserver.findOne({ id: msg.guild.id }, (err, res) => {

            var channel = msg.mentions.channels.first();
            if(!channel) return msg.channel.send(`You need to mention the channel. Example: \`$channel #channel\``)
            if(err) return console.log(err);
            if(!res){
                const upSchema = new UNserver({
                    _id: mongoose.Types.ObjectId(),
                    owner : msg.guild.owner.user.username,
                    prefix : "$",
                    boost_channel : channel.id,
                    id : msg.guild.id
                })
                
                upSchema.save()
                .then(() => msg.channel.send(`Successfully changed boost notification channel to ${channel.toString()}`))
                .catch(err => console.log(err))
            }else{
                res.boost_channel = channel.id;

                res.save()
                .then(() => msg.channel.send(`Successfully changed boost notification channel to ${channel.toString()}`))
                .catch(err => console.log(err))
            }

        }).catch(err => console.log(err))


    }

    
}