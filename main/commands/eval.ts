import Discord from 'discord.js'


export default {
  name: 'eval',
  execute(msg: Discord.Message, args: string[]) {

    const clean = (text: string ) => {
      if(typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }

    if(msg.author.id !== "264010327023288323") return;

    try {
      args.shift();
      const code = args.join(" ");
      let evaled = eval(code);

      if(typeof evaled !== "string")
        evaled = require('util').inspect(evaled);

      msg.channel.send(clean(evaled), { code: "xl" });
    } catch (e) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(e)}\n\`\`\``);
    }
  }
}
