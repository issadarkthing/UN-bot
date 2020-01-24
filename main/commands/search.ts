import cheerio from 'cheerio'
import Discord from 'discord.js'
import request from 'request'

export const rolesColor = {
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
}

export default {
  name: "search",
  async execute(msg: Discord.Message, args: string[]) {

    const url = "https://habboun.com/user/" + args[1].toLowerCase();

    request(url, (err: Error, res, body) => {

      if(err || res.statusCode !== 200) return msg.channel.send("Error in fetching data")



      const $ = cheerio.load(body)
      const username = $('.pane-user-name').children('div.pane-content').text().trim()
      const habboUsername = $('.pane-user-field-habbo-username').children('div.pane-content').text().trim()

      const points: string[] = []
      $('.userpoints-points').each((i, el) => {
        points.push($(el).text())
      })

      const imageUrl = $("div.user-picture img").attr("src")?.endsWith(".png")
        ? "https://i.imgur.com/izPhBos.png"
        : $("div.user-picture img").attr("src");

      if(!imageUrl) return msg.channel.send("User does not exists or you are not authorized to access the page")

      const lastRewardLogged = $('.pane-user-field-last-time-points-were-give').find('em.placeholder').text()

      const rank = $('.pane-user-roles div.pane-content').text().trim()



      try {

        const embed = new Discord.RichEmbed()
        .setColor(setColor(rank))
        .setThumbnail(imageUrl)
        .addField("Username", username || "", true)
        .addField("Habbo Username", habboUsername || "", true)
        .addField("Points", points.join("\n") || "none")
        .addField("Last Reward Logged", lastRewardLogged || "none", true)
        .addField("Achieved Roles", rank || "none");
  
        msg.channel.send(embed);

      } catch(e) {
        msg.channel.send("No data")
        console.log(e);
      }


    })


  }
} 

export function setColor(achivedRoles: string) {
  const keyColor = getRank(achivedRoles)
  return rolesColor[/ownership/ig.test(keyColor) ? "ownership" : keyColor as keyof typeof rolesColor]
}

export function getRank(achivedRoles: string) {
  const ranks = achivedRoles.split(',').map(x => x.trim())
  return ranks[1].toLowerCase().slice(3).trim().replace(/\s/mg, "_")
}