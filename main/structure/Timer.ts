import { Schema, model } from "mongoose"


const schema = new Schema({
	_id: Schema.Types.ObjectId,
	guildId: String,
	userId: String,
	timePosted: Number,
	username: String,
	duration: Number,
	messageId: String,
	description: String,
	messageUrl: String,
	channelId: String,
	rolesId: Array,
	mentionEveryone: Boolean,
	completed: Boolean
})

export const timerDb = model("unserver", schema)


export interface TimerDb {
    guildId: string
	_id: Schema.Types.ObjectId;
	userId: string;
	timePosted: number;
	username: string;
	duration: number;
	messageId: string;
	description: string;
	messageUrl: string;
	channelId: string;
	completed: boolean;
	rolesId: string[];
	mentionEveryone: boolean;
	save(): void;
}
