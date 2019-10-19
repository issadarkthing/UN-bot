
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
bot.commands = new Discord.Collection();
const mongoose = require('mongoose');
const UNserver = require('./model');
const prefix = "$";
const boost = require('./src/boost');
const rain = require('./src/rain');
const reaction = require('./src/reaction');
const token = process.env.token;
const uri = process.env.uri;
const config = require('./config.json');

for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

mongoose.connect(config.uri, {useNewUrlParser: true}); //change this later


bot.on("ready", () => {
    console.log('Bot has started!');
    bot.user.setActivity("Habbo", { type : "PLAYING" });
});

bot.on("guildMemberUpdate", (oldMember, newMember) => {

    boost.execute(oldMember, newMember);

});

bot.on("message", async msg => {

    rain.execute(msg, bot);

    if(msg.author.bot) return;

    reaction.execute(msg);

    let args = await msg.content.substring(prefix.length).split(" ");

    const command = bot.commands.get(args[0]) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

    if(msg.content.startsWith(prefix) && command) {
        try{
            command.execute(msg, args);

        }catch(err){
            console.log(err)
            msg.channel.send('There was an error trying to execute the command!');
        }
    }
})



bot.login(config.token); //change this later
