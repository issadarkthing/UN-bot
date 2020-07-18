import Discord from "discord.js";
import { big_three_id } from "./utils";

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

		const SERVER_ID = process.env.SERVER_ID;
		const CHANNEL_ID = process.env.CHANNEL_ID;
		const BOOST_ROLE_ID = process.env.BOOST_ROLE_ID;
		const ADMIN_ID = process.env.ADMIN_ID;

		const ADMINS_ID = Object.keys(big_three_id);

		if (!SERVER_ID || !CHANNEL_ID || !BOOST_ROLE_ID || !ADMIN_ID)
			throw Error("No process env specified");

		// make announcement using command
		if (msg && args) {

			// only few people can use this command
			// including me
			if (
				!ADMINS_ID.includes(msg.author.id) &&
				args[0] !== "boost" &&
				msg.author.id !== ADMIN_ID
			) return;


			// check if channel exists
			const tmpChan = msg.client.guilds.get(SERVER_ID)
				?.channels.get(CHANNEL_ID);

			if (!tmpChan) return msg.channel.send("Channel not found");

			channel = tmpChan;

			// check if member exists
			const tmpMember = msg.client.guilds.get(SERVER_ID)
				?.members.get(args[1]);

			if (!tmpMember) return msg.channel.send("Member not found");

			member = tmpMember;

		} else if (
			// check if role has changed from no boost role to boost role
			oldMember?.roles.has(BOOST_ROLE_ID) === false &&
			newMember?.roles.has(BOOST_ROLE_ID) === true
		) {
			const _channel = newMember.client.guilds.get(SERVER_ID)
				?.channels.get(CHANNEL_ID);

			if (!_channel) throw Error("Channel not found");

			channel = _channel;
			member = newMember;

		} else return;

		const boostEmoji =
			channel.guild.emojis.find(e => e.name === "boosting") || "🎉";
		const gbEmoji =
			channel.guild.emojis.find(e => e.id === "479631989335654430") || "";
		const HCEmoji =
			channel.guild.emojis.find(e => e.id === "606919195279491118") || "";
		const nitroEmoji =
			channel.guild.emojis.find(e => e.id === "616293973484371988") || "";


		const title = `${nitroEmoji} 🎉 ${member.displayName} just boosted the server! 🎉`
		const desc = `Thank you for contributing, you will receive your own unique emoji, updated nickname, 50c ${gbEmoji} and 31 days of HC ${HCEmoji}`

		const color = "3232FF"

		const embed = new Discord.RichEmbed()
			.setColor(color)
			.setThumbnail(member.user.avatarURL)
			.addField(title, desc);


		(channel as Discord.TextChannel).send("**Announcement** @here");


		const m = await (channel as Discord.TextChannel).send(embed)

		const emojis = ["😱", "❤", "😍", "🔥", "🍌", boostEmoji]

		emojis.forEach(v => {
			m.react(v)
		})

	}
};
