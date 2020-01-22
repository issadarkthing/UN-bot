import Discord from 'discord.js'
import fs from 'fs';
import boost from './src/boost'


const bot = new Discord.Client();
const commandFiles = fs.readdirSync(__dirname + '\\commands').filter(file => file.endsWith('.js'));
const token = process.env.token || ""
const commands = new Discord.Collection<string, Command>();


export const config = {
    PREFIX: "$",
    SERVER_ID: "612515458767388698",
    CHANNEL_ID: "669445934182170624",
    BOOST_ROLE_ID: "669450560310607882",
    ADMIN_ID: "264010327023288323"
}





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
    

    const args = msg.content.substring(config.PREFIX.length).split(" ");

    if(msg.channel.type === "dm"){
        boost.execute({ msg, args });
    }
    

    const command = commands.get(args[0]) || commands.find(cmd => cmd.aliases?.includes(args[0]) || false );

    if(msg.content.startsWith(config.PREFIX) && command) {
        try{
            command.execute(msg, args);
            
        }catch(err){
            console.log(err)
            msg.channel.send('There was an error trying to execute the command!');
        }
    }
})



bot.login(token); 