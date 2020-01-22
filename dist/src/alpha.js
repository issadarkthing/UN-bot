"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
exports.default = {
    execute: function (msg, args) {
        var validUsers = ["292019603544997888", "478042194322915329", "264010327023288323", "378745839947874304"];
        var serverId = "388892644929175552";
        if (!validUsers.includes(msg.author.id))
            return;
        var server = msg.client.guilds.get(serverId);
        if (!server)
            throw Error("Server not found");
        var channel = server.channels.find(function (c) { return c.id === "478206001544429569"; }) || "";
        var emoji = server.emojis.find(function (e) { return e.name === "boosting"; }) || "";
        var gbEmoji = server.emojis.find(function (e) { return e.id === "479631989335654430"; }) || "";
        var HCEmoji = server.emojis.find(function (e) { return e.id === "606919195279491118"; }) || "";
        var nitroEmoji = server.emojis.find(function (e) { return e.id === "616293973484371988"; }) || "";
        var everyone = server.defaultRole;
        var member = server.members.get(args[1]);
        if (!member)
            return msg.channel.send("member not found");
        var embed = new discord_js_1.default.RichEmbed()
            .setColor('3232FF')
            .setThumbnail(member.user.avatarURL)
            .addField(nitroEmoji + " \uD83C\uDF89 " + member.displayName + " just boosted the server! \uD83C\uDF89", "\nThank you for contributing, you will receive your own unique emoji, updated nickname, 50c " + gbEmoji + " and 31 days of HC " + HCEmoji);
        channel.send("**Announcement** " + everyone);
        channel.send(embed)
            .then(function (m) { return m.react('😱')
            .then(function () { return m.react('❤'); })
            .then(function () { return m.react('😍'); })
            .then(function () { return m.react('🔥'); })
            .then(function () { return m.react('🍌'); })
            .then(function () { return m.react(emoji || "👍"); }); });
    }
};
