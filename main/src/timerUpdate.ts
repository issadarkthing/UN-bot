import { timerDb, TimerDb } from "../structure/Timer";
import Discord from "discord.js";
import { convert, periods, countdownBanner } from "./utils";

async function timerUpdate(bot: Discord.Client) {
	const messages = ((await timerDb.find({
		completed: false
	})) as any) as TimerDb[];

	if(!messages) return;

	messages.forEach((message: TimerDb) => {
		const timeLeft = message.duration - (Date.now() - message.timePosted);

		const channel = bot.guilds
			.get(message.guildId)
			?.channels.get(message.channelId) as Discord.TextChannel;

		const msg = channel?.messages.get(message.messageId);

		if(!msg) {
			message.completed = true;
			message.save()
			channel.send(`Timer ${message.messageUrl} is no longer usable. It's been removed from cache storage or the bot crashed.`)
			return
		}


		if (timeLeft <= periods.minute) {
			message.completed = true;
			const countdown = '0h : 0m'
			msg.edit(countdownBanner(countdown, message.username, message.description))
		} else {
			const countdown = convert(timeLeft)
			msg.edit(countdownBanner(countdown, message.username, message.description))
		}

		message.save();
	});
}

export function runTimerUpdate(interval: number, bot: Discord.Client) {
	setInterval(() => {
		timerUpdate(bot);
	}, interval);
}
