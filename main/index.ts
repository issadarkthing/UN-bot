import Discord from "discord.js";
import mongoose from "mongoose";
import fs from "fs";
import boost from "./src/boost";
import { runTimerUpdate } from "./src/timerUpdate";
import { periods } from "./src/utils";

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN || "";
const uri = process.env.MONGODB_URI;
const PREFIX = process.env.PREFIX || "$";

if (!uri) throw Error("No mongodb uri");

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

interface Command {
	name: string;
	description: string;
	aliases?: string[];
	execute(msg: Discord.Message, args: string[]): any;
}

//loads commands
const commands = new Discord.Collection<string, Command>();
const commandFiles = fs
	.readdirSync(__dirname + "/commands")
	.filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.set(command.default.name, command.default);
}

bot.on("ready", () => {
	console.log("Bot has started!");
	bot.user.setActivity("Habbo", { type: "PLAYING" });
	runTimerUpdate(periods.minute / 2, bot);
});

bot.on(
	"guildMemberUpdate",
	(oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
		boost.execute({ oldMember, newMember });
	}
);

bot.on("message", async msg => {
	if (msg.author.bot) return;

	const args = msg.content.substring(PREFIX.length).split(" ");

	if (msg.channel.type === "dm") {
		boost.execute({ msg, args });
	}

	const command =
		commands.get(args[0]) ||
		commands.find(cmd => cmd.aliases?.includes(args[0]) || false);

	if (msg.content.startsWith(PREFIX) && command) {
		try {
			command.execute(msg, args);
		} catch (err) {
			console.log(err);
			msg.channel.send(
				"There was an error trying to execute the command!"
			);
		}
	}
});

bot.login(TOKEN);
