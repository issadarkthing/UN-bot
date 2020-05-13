import { TimerDb } from "../structure/Timer";
import Discord from "discord.js"

export const periods: { [key: string]: number } = {
	year: 12 * 30 * 24 * 60 * 60 * 1000,
	month: 30 * 24 * 60 * 60 * 1000,
	week: 7 * 24 * 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000
};


export function countdownBanner(message: string, createdBy: string, description: string) {

	return new Discord.RichEmbed()
		.setColor(color.blue)
		.addField("Description", description)
		.addField("Countdown", `\`${message}\``)
		.setFooter("Created by " + createdBy)

}

export const big_three_id = {
	Tiing_id: "378745839947874304",
	cyndii_id: "292019603544997888",
	purple_id: "478042194322915329",
}

export const role_id: { [key: string]: string } = {
	ooa_id: "588651986786975744",
	owner_id: "378745839947874304"
}

export const timeAbbv: { [key: string]: string } = {
	Y: "year",
	M: "month",
	w: "week",
	d: "day",
	h: "hour",
	m: "minute"
};

export const color = {
	blue: "#1919FF"
}

//exclusive
export function randomBetween(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min
}

export function convert(unixTime: number) {
	if (unixTime > periods.day) {
		const days = Math.floor(unixTime / periods.day);
		const remainder = unixTime - days * periods.day;
		const hours =
			remainder > periods.hour ? Math.floor(remainder / periods.hour) : 0;
		const minRemainder = remainder - hours * periods.hour;
		const mins =
			minRemainder > periods.minute
				? Math.floor(minRemainder / periods.minute)
				: 0;
		return `${days}d : ${hours}h : ${mins}m`;
	} else if (unixTime > periods.hour) {
		const hour = Math.floor(unixTime / periods.hour);
		const remainder = unixTime - hour * periods.hour;
		const mins =
			remainder > periods.minute
				? Math.floor(remainder / periods.minute)
				: 0;
		return `${hour}h : ${mins}m`;
	} else if (unixTime > periods.minute) {
		const hour = 0;
		const mins = Math.floor(unixTime / periods.minute);
		return `${hour}h : ${mins}m`;
	} else {
		return `0h : 0m`;
	}
}
