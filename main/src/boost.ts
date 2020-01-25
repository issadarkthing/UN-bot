import Discord, { BaseOpus } from "discord.js";


export default {
  async execute({
    oldMember,
    newMember,
    msg,
    args
  }: {
    oldMember?: Discord.GuildMember;
    newMember?: Discord.GuildMember;
    msg?: Discord.Message;
    args?: string[];
  } = {}) {


    let channel: Discord.GuildChannel;
    let member: Discord.GuildMember;

    const SERVER_ID = process.env.SERVER_ID
    const CHANNEL_ID = process.env.CHANNEL_ID
    const BOOST_ROLE_ID = process.env.BOOST_ROLE_ID
    const ADMIN_ID = process.env.BOOST_ROLE_ID

    if(!SERVER_ID || !CHANNEL_ID || !BOOST_ROLE_ID || !ADMIN_ID) throw Error("No process env specified")


    if (msg && args) {

      if (msg.author.id !== ADMIN_ID && args[0] !== "boost") return;
      const _channel = msg.client.guilds.get(SERVER_ID)?.channels.get(CHANNEL_ID);
      if (!_channel) throw Error("Channel not found");
      channel = _channel;
      const _member = msg.client.guilds.get(SERVER_ID)?.members.get(args[1]);
      if (!_member) return msg.channel.send("Member not found");
      member = _member;

    } else if (
      oldMember?.roles.has(BOOST_ROLE_ID) === false &&
      newMember?.roles.has(BOOST_ROLE_ID) === true
    ) {

      const _channel = newMember.client.guilds.get(SERVER_ID)?.channels.get(CHANNEL_ID);
      if (!_channel) throw Error("Channel not found");
      channel = _channel;
      member = newMember;

    } else return;

    

    const emoji = channel.guild.emojis.find(e => e.name === "boosting") || "";
    const gbEmoji =
      channel.guild.emojis.find(e => e.id === "479631989335654430") || "";
    const HCEmoji =
      channel.guild.emojis.find(e => e.id === "606919195279491118") || "";
    const nitroEmoji =
      channel.guild.emojis.find(e => e.id === "616293973484371988") || "";
    const everyone = channel.guild.defaultRole;


      const embed = new Discord.RichEmbed()
        .setColor("3232FF")
        .setThumbnail(member.user.avatarURL)
        .addField(
          `${nitroEmoji} 🎉 ${member.displayName} just boosted the server! 🎉`,
          `
Thank you for contributing, you will receive your own unique emoji, updated nickname, 50c ${gbEmoji} and 31 days of HC ${HCEmoji}`
        );
      (channel as Discord.TextChannel).send(`**Announcement** ${everyone}`)
      .catch((e) => {
        console.log(e);
      });
      (channel as Discord.TextChannel).send(embed).then(m =>
        (m as Discord.Message)
          .react("😱")
          .then(() => (m as Discord.Message).react("❤"))
          .then(() => (m as Discord.Message).react("😍"))
          .then(() => (m as Discord.Message).react("🔥"))
          .then(() => (m as Discord.Message).react("🍌"))
          .then(() => (m as Discord.Message).react(emoji || "👍"))
      );




  }
};
