import Discord from "discord.js";
import request from "request";
import cheerio from "cheerio";
import { getRank, rolesColor, setColor } from "./search";

const rolesId = new Map<string, string>();

const _rolesId = [
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

let i = 0
for (const role in setColor) {
  rolesId.set(role, _rolesId[i])
  i++
}

export default {
  name: "rankup",
  async execute(msg: Discord.Message, args: string[]) {

    if(!args[1]) return msg.channel.send("You need to specify a habboUN username.")

    const url = "https://habboun.com/user/" + args[1].toLowerCase();

    if(!msg.member.roles.some(v => _rolesId.includes(v.id))) 
        return msg.channel.send("Need to have at least one UN role");



    request(url, (err, res, body) => {
      if (err || res.statusCode !== 200)
        return msg.channel.send("Error in fetching data");

      const $ = cheerio.load(body);

      const ranks = $(".pane-user-roles div.pane-content").text().trim();

      const rankName = getRank(ranks)

      const selectedRoleId = rolesId.get(rankName)!

      if(msg.member.roles.has(selectedRoleId)) return msg.channel.send("You already have the role")

      try {
        msg.member.addRole(selectedRoleId, "Ranked up to " + rankName)
      } catch (error) {
        msg.channel.send("Need 'Manage roles' permission")
      }
      

      msg.channel.send("Congratulations on ranking up to " + ranks.split(",")[1].trim())


    });
  }
};
