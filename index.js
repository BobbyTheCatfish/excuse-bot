/* eslint-disable no-console */
// @ts-check
const Discord = require("discord.js");
const config = require("./config.json");
const data = require("./data");
const cmdSF = require("./registry/snowflakes-commands.json");
const Client = new Discord.Client({ intents: ["MessageContent", "Guilds", "GuildMessages"] });

Client.login(config.token);

/** @param {Discord.Message | Discord.ChatInputCommandInteraction} input */
function later(input) {
  const response = `${data.opening.getRandom()} ${data.person.getRandom()} ${data.event.getRandom()}`
    .replaceAll("<@authorname>", "user" in input ? input.user.displayName : input.author.displayName)
    .replaceAll("<@channel>", input.channel?.toString() ?? "Here");
  input.reply(response);
}

Client.on("interactionCreate", (int) => {
  if (int.isChatInputCommand() && int.commandId === cmdSF.commands.slashExcuse) later(int);
})
.on("messageCreate", (msg) => {
  const args = msg.content.split(" ");
  if (args[0] === "!later") later(msg);
})
.on("ready", () => {
  console.log(`Ready at ${new Date().toString()}`);
});

process.on("unhandledRejection", (err, p) => p.catch(() => console.log(err)));
process.on("uncaughtException", (err) => console.log(err));