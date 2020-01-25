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
var cheerio_1 = __importDefault(require("cheerio"));
var discord_js_1 = __importDefault(require("discord.js"));
var request_1 = __importDefault(require("request"));
exports.rolesColor = {
    agent: "#3232FF",
    security: "#595959",
    trainers: "#006600",
    operations: "#c68c53",
    high_management: "#b30000",
    senior_management: "#e68a00",
    leadership: "#993399",
    government: "#6699ff",
    moderator: "#993399",
    office_of_administration: "#4d4d4d",
    ownership: "#0d0d0d"
};
exports.default = {
    name: "search",
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = "https://habboun.com/user/" + args[1].toLowerCase();
                request_1.default(url, function (err, res, body) {
                    var _a;
                    if (err || res.statusCode !== 200)
                        return msg.channel.send("Error in fetching data");
                    var $ = cheerio_1.default.load(body);
                    var username = $('.pane-user-name').children('div.pane-content').text().trim();
                    var habboUsername = $('.pane-user-field-habbo-username').children('div.pane-content').text().trim();
                    var points = [];
                    $('.userpoints-points').each(function (i, el) {
                        points.push($(el).text());
                    });
                    var imageUrl = ((_a = $("div.user-picture img").attr("src")) === null || _a === void 0 ? void 0 : _a.endsWith(".png")) ? "https://i.imgur.com/izPhBos.png"
                        : $("div.user-picture img").attr("src");
                    if (!imageUrl)
                        return msg.channel.send("User does not exists or you are not authorized to access the page");
                    var lastRewardLogged = $('.pane-user-field-last-time-points-were-give').find('em.placeholder').text();
                    var rank = $('.pane-user-roles div.pane-content').text().trim();
                    try {
                        var embed = new discord_js_1.default.RichEmbed()
                            .setColor(setColor(rank))
                            .setThumbnail(imageUrl)
                            .addField("Username", username || "", true)
                            .addField("Habbo Username", habboUsername || "", true)
                            .addField("Points", points.join("\n") || "none")
                            .addField("Last Reward Logged", lastRewardLogged || "none", true)
                            .addField("Achieved Roles", rank || "none");
                        msg.channel.send(embed);
                    }
                    catch (e) {
                        msg.channel.send("No data");
                        console.log(e);
                    }
                });
                return [2 /*return*/];
            });
        });
    }
};
function setColor(achivedRoles) {
    var keyColor = getRank(achivedRoles);
    return exports.rolesColor[/ownership/ig.test(keyColor) ? "ownership" : keyColor];
}
exports.setColor = setColor;
function getRank(achivedRoles) {
    var ranks = achivedRoles.split(',').map(function (x) { return x.trim(); });
    return ranks[1].toLowerCase().slice(3).trim().replace(/\s/mg, "_");
}
exports.getRank = getRank;
