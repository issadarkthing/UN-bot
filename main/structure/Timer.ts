import { Schema, model } from "mongoose"


const schema = new Schema({
	_id: Schema.Types.ObjectId,
	guildId: String,
	userId: String,
	timePosted: Number,
	username: String,
	duration: Number,
	messageId: String,
	messageUrl: String,
	channelId: String,
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
	messageUrl: string;
	channelId: string;
	completed: boolean;
	save(): void;
}
