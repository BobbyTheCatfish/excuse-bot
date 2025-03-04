/* eslint-disable no-console */
// @ts-check
const Discord = require("discord.js");
const config = require("./config.json");
const data = require("./data");

const Client = new Discord.Client({ intents: ["MessageContent", "Guilds", "GuildMessages"] });

Client.login(config.token);

Client.on("messageCreate", (msg) => {
  const args = msg.content.split(" ");
  if (args[0] !== "!later") return;
  const response = `${data.opening.getRandom()} ${data.person.getRandom()} ${data.event.getRandom()}`
        .replaceAll("<@authorname>", msg.author.displayName)
        .replaceAll("<@channel>", msg.channel.toString());
  msg.reply(response);
})
.on("ready", () => {
  console.log(`Ready at ${new Date().toString()}`);
});

process.on("unhandledRejection", (err, p) => p.catch(() => console.log(err)));
process.on("uncaughtException", (err) => console.log(err));