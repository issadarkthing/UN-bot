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

		let hasValidRole = false;
		for (const key in role_id) {
			hasValidRole = msg.member.roles.has(role_id[key]);
		}

		if (
			!(Object.values(big_three_id).includes(msg.author.id)) &&
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

		const countdown = convert(duration)
		const timerMsg = await msg.channel.send(countdownBanner(countdown, msg.author.username));

		const timer = new timerDb({
			_id: Types.ObjectId(),
			userId: msg.author.id,
			guildId: timerMsg.guild.id,
			timePosted: currTime,
			username: msg.author.username,
			duration,
			messageId: timerMsg.id,
			messageUrl: timerMsg.url,
			channelId: timerMsg.channel.id,
			completed: false
		});

		timer.save().catch(e => console.error(e));
	}
};

//returns unix time
function parseInput(input: string) {
	const ptime = parseInt(input.substring(0, input.length - 1));
	const speriod = periods[timeAbbv[input[input.length - 1]]];
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

	const filter = (m: Discord.Message) => m.content.includes("yes");

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
