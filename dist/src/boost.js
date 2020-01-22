"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
exports.default = {
    execute: function (_a) {
        var _b = _a === void 0 ? {} : _a, oldMember = _b.oldMember, newMember = _b.newMember, msg = _b.msg, args = _b.args;
        var _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var SERVER_ID, CHANNEL_ID, BOOST_ROLE_ID, channel, member, _channel, _member, _channel, emoji, gbEmoji, HCEmoji, nitroEmoji, everyone, embed;
            return __generator(this, function (_h) {
                SERVER_ID = "612515458767388698";
                CHANNEL_ID = "669445934182170624";
                BOOST_ROLE_ID = "669450560310607882";
                if (msg && args) {
                    if (msg.author.id !== "264010327023288323" && args[0] !== "boost")
                        return [2 /*return*/];
                    _channel = (_c = msg.client.guilds.get(SERVER_ID)) === null || _c === void 0 ? void 0 : _c.channels.get(CHANNEL_ID);
                    if (!_channel)
                        throw Error("Channel not found");
                    channel = _channel;
                    _member = (_d = msg.client.guilds.get(SERVER_ID)) === null || _d === void 0 ? void 0 : _d.members.get(args[1]);
                    if (!_member)
                        return [2 /*return*/, msg.channel.send("Member not found")];
                    member = _member;
                }
                else if (((_e = oldMember) === null || _e === void 0 ? void 0 : _e.roles.has(BOOST_ROLE_ID)) === false &&
                    ((_f = newMember) === null || _f === void 0 ? void 0 : _f.roles.has(BOOST_ROLE_ID)) === true) {
                    _channel = (_g = newMember.client.guilds.get(SERVER_ID)) === null || _g === void 0 ? void 0 : _g.channels.get(CHANNEL_ID);
                    if (!_channel)
                        throw Error("Channel not found");
                    channel = _channel;
                    member = newMember;
                }
                else
                    return [2 /*return*/];
                emoji = channel.guild.emojis.find(function (e) { return e.name === "boosting"; }) || "";
                gbEmoji = channel.guild.emojis.find(function (e) { return e.id === "479631989335654430"; }) || "";
                HCEmoji = channel.guild.emojis.find(function (e) { return e.id === "606919195279491118"; }) || "";
                nitroEmoji = channel.guild.emojis.find(function (e) { return e.id === "616293973484371988"; }) || "";
                everyone = channel.guild.defaultRole;
                embed = new discord_js_1.default.RichEmbed()
                    .setColor("3232FF")
                    .setThumbnail(member.user.avatarURL)
                    .addField(nitroEmoji + " \uD83C\uDF89 " + member.displayName + " just boosted the server! \uD83C\uDF89", "\nThank you for contributing, you will receive your own unique emoji, updated nickname, 50c " + gbEmoji + " and 31 days of HC " + HCEmoji);
                channel.send("**Announcement** " + everyone);
                channel.send(embed).then(function (m) {
                    return m
                        .react("😱")
                        .then(function () { return m.react("❤"); })
                        .then(function () { return m.react("😍"); })
                        .then(function () { return m.react("🔥"); })
                        .then(function () { return m.react("🍌"); })
                        .then(function () { return m.react(emoji || "👍"); });
                });
                return [2 /*return*/];
            });
        });
    }
};
