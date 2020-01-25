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
var request_1 = __importDefault(require("request"));
var cheerio_1 = __importDefault(require("cheerio"));
var search_1 = require("./search");
var rolesId = new Map();
var _rolesId = [
    "669579373052952578",
    "669579372667076608",
    "669579371828215828",
    "669579371119378442",
    "669579370288906251",
    "669579369399975954",
    "669579368552595477",
    "669579367659077662",
    "669579366719553556",
    "669579365780029441",
    "669579362806398996"
];
var i = 0;
for (var role in search_1.setColor) {
    rolesId.set(role, _rolesId[i]);
    i++;
}
exports.default = {
    name: "rankup",
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                if (!args[1])
                    return [2 /*return*/, msg.channel.send("You need to specify a habboUN username.")];
                url = "https://habboun.com/user/" + args[1].toLowerCase();
                if (!msg.member.roles.some(function (v) { return _rolesId.includes(v.id); }))
                    return [2 /*return*/, msg.channel.send("Need to have at least one UN role")];
                request_1.default(url, function (err, res, body) {
                    if (err || res.statusCode !== 200)
                        return msg.channel.send("Error in fetching data");
                    var $ = cheerio_1.default.load(body);
                    var ranks = $(".pane-user-roles div.pane-content").text().trim();
                    var rankName = search_1.getRank(ranks);
                    var selectedRoleId = rolesId.get(rankName);
                    if (msg.member.roles.has(selectedRoleId))
                        return msg.channel.send("You already have the role");
                    try {
                        msg.member.addRole(selectedRoleId, "Ranked up to " + rankName);
                    }
                    catch (error) {
                        msg.channel.send("Need 'Manage roles' permission");
                    }
                    msg.channel.send("Congratulations on ranking up to " + ranks.split(",")[1].trim());
                });
                return [2 /*return*/];
            });
        });
    }
};
