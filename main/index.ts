import Discord from 'discord.js'
import fs from 'fs';
import boost from './src/boost'


const bot = new Discord.Client();
const commandFiles = fs.readdirSync(__dirname + '\\commands').filter(file => file.endsWith('.js'));
const TOKEN = process.env.token || ""
const commands = new Discord.Collection<string, Command>();



const PREFIX = process.env.PREFIX || "$"




interface Command {
    name: string,
    description: string,
    aliases?: string[],
    execute(msg: Discord.Message, args: string[]): any
}

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.set(command.default.name, command.default);
}




bot.on("ready", () => {
    console.log('Bot has started!');
    bot.user.setActivity("Habbo", { type : "PLAYING" });
});

bot.on("guildMemberUpdate", (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {

    boost.execute({ oldMember, newMember });

});

bot.on("message", async msg => {

    

    if(msg.author.bot) return;
    

    const args = msg.content.substring(PREFIX.length).split(" ");

    if(msg.channel.type === "dm"){
        boost.execute({ msg, args });
    }
    

    const command = commands.get(args[0]) || commands.find(cmd => cmd.aliases?.includes(args[0]) || false );

    if(msg.content.startsWith(PREFIX) && command) {
        try{
            command.execute(msg, args);
            
        }catch(err){
            console.log(err)
            msg.channel.send('There was an error trying to execute the command!');
        }
    }
})



bot.login(TOKEN); 