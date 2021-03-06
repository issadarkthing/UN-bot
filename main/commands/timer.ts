import Discord from "discord.js";
import { timerDb, TimerDb } from "../structure/Timer";
import { Types } from "mongoose";
import {
	periods,
	convert,
	timeAbbv,
	color,
	big_three_id,
	role_id,
	countdownBanner
} from "../src/utils";

export default {
	name: "timer",
	async execute(msg: Discord.Message, args: string[]) {

		if (!process.env.MONGODB_URI) return msg.channel.send("No mongodb uri specified")

		let hasValidRole = false;

		for (const key in role_id) {
			hasValidRole = msg.member.roles.has(role_id[key]);
		}

		if (
			!Object.values(big_three_id).includes(msg.author.id) &&
			!hasValidRole &&
			msg.author.id !== process.env.ADMIN_ID
		)
			return;
		//validation

		if (!args[1]) return msg.channel.send("Usage: `$timer 1h`");
		if (args[1] === "all") return timerAll(msg);
		if (args[1] === "cancel") return cancelTimer(args, msg);

		const currTime = Date.now();
		let duration;
		try {
			duration = args
				.slice(1)
				.map(x => parseInput(x))
				.reduce((acc, x) => acc + x);
		} catch (e) {
			msg.channel.send("Invalid syntax");
			return;
		}

		const description = await getInput(
			"Description",
			"Please add description for this timer",
			msg
		);

		if (description.content.length > 100)
			return msg.channel.send("Description too long. Timer cancelled");

		const roleMention = await getInput(
			"Role Mentions",
			"Please select **roles** to be mentioned by mentioning multiple roles",
			msg
		);

		const selectedRoles = Array.from(roleMention.mentions.roles.keys());


		if (selectedRoles.length === 0 && !roleMention.mentions.everyone)
			return msg.channel.send("Invalid role. Timer cancelled");

		const channelMention = await getInput(
			"Channel",
			"Please specify a **channel** by mentioning the channel",
			msg
		);

		const selectedChannel = channelMention.mentions.channels.first();
		if (!selectedChannel)
			return msg.channel.send("Invalid channel. Timer cancelled");


		if (selectedChannel.type !== "text")
			return msg.channel.send("Cannot send to non-text channel");

		const countdown = convert(duration);

		const timerMsg = await ((selectedChannel as any) as Discord.TextChannel).send(
			countdownBanner(countdown, msg.author.username, description.content)
		);

		const timer = new timerDb({
			_id: Types.ObjectId(),
			userId: msg.author.id,
			guildId: timerMsg.guild.id,
			timePosted: currTime,
			username: msg.member.nickname || msg.author.username,
			description,
			duration,
			messageId: timerMsg.id,
			messageUrl: timerMsg.url,
			channelId: selectedChannel.id,
			rolesId: selectedRoles,
			mentionEveryone: roleMention.mentions.everyone,
			completed: false
		});

		timer.save().catch(e => console.error(e));

		const timerCreated = new Discord.RichEmbed()
			.setColor(color.blue)
			.addField(
				"Timer created",
				`[Timer](${timerMsg.url}) has been created successfully`
			);

		msg.channel.send(timerCreated);
	}
};

//returns unix time
function parseInput(input: string) {
	// slice from start until second last character of string
	// example 12h -> 12
	const ptime = parseInt(input.substring(0, input.length - 1));
	// converts `h` to number equivalent in unix time (ms)
	// example `h` -> 60 * 60 * 1000
	const speriod = periods[timeAbbv[input[input.length - 1]]];
	// calculate total time
	const result = ptime * speriod;
	if (!result) throw Error;
	return result;
}

async function timerAll(msg: Discord.Message) {
	const currTime = Date.now();
	const timers = ((await timerDb.find({
		completed: false
	})) as any) as TimerDb[];
	const rows = timers
		.filter(x => {
			const timeLeft = x.duration - (currTime - x.timePosted);
			return timeLeft >= periods.minute;
		})
		.map((x, i) => {
			const timeLeft = x.duration - (currTime - x.timePosted);
			return `${i + 1}. [timer${i + 1}](${x.messageUrl}) \`${convert(
				timeLeft
			)}\``;
		});

	if (rows.length === 0) {
		msg.channel.send("There are no instance of timer running");
		return;
	}

	const embed = new Discord.RichEmbed()
		.setColor("#1919FF")
		.addField("Timers", rows.join("\n"));

	msg.channel.send(embed);
}

async function cancelTimer(args: string[], msg: Discord.Message) {
	if (args.length < 3)
		return msg.channel.send("Please provide timer/message id");

	const timer = ((await timerDb.findOne({
		messageId: args[2],
		completed: false
	})) as any) as TimerDb;
	if (!timer) return msg.channel.send("Timer id given does not exists");

	const filter = (m: Discord.Message) =>
		m.content.includes("yes") && m.author.id === msg.author.id;

	const confirmEmbed = new Discord.RichEmbed()
		.setColor(color.blue)
		.addField(
			"Confirmation",
			`Are you sure to cancel [timer](${timer.messageUrl}) ? Reply \`yes\` to confirm`
		);

	await msg.channel.send(confirmEmbed);

	try {
		const collected = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: periods.minute,
			errors: ["time"]
		});

		if (collected.first().content !== "yes") {
			msg.channel.send("Please reply with `yes` only");
			return;
		}
	} catch {
		msg.channel.send("Time's up");
		return;
	}

	timer.completed = true;
	timer.save();

	const infoEmbed = new Discord.RichEmbed()
		.setColor(color.blue)
		.addField(
			"Timer cancellation succeed",
			`[Timer](${timer.messageUrl}) has been cancelled`
		);
	msg.channel.send(infoEmbed);
}

async function getInput(
	title: string,
	description: string,
	msg: Discord.Message
) {
	const confirmEmbed = new Discord.RichEmbed()
		.setColor(color.blue)
		.addField(title, description);

	await msg.channel.send(confirmEmbed);

	const filter = (m: Discord.Message) => m.author.id === msg.author.id;

	const collected = await msg.channel.awaitMessages(filter, {
		max: 1,
		time: periods.minute,
		errors: ["time"]
	});

	return collected.first();
}
