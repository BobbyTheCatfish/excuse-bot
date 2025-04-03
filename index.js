/* eslint-disable no-console */
// @ts-check
const Discord = require("discord.js");
const config = require("./config.json");
const data = require("./data");
const cmdSF = require("./registry/snowflakes-commands.json");
const Client = new Discord.Client({ intents: ["MessageContent", "Guilds", "GuildMessages"] });

Client.login(config.token);

/**
 * @template T
 * @param {T[]} elements
 * @returns {T}
 */
function rand(elements) {
  return elements[Math.floor(Math.random() * elements.length)];
}

/** @param {Discord.Message | Discord.ChatInputCommandInteraction} input */
function later(input) {
  const set = Math.random() < 0.5 ? data.fun : data.work;
  const channel = input.guild ?
    rand(input.guild.channels.cache.filter(c => c.permissionsFor(input.guildId ?? "")?.has("ViewChannel") && c.isSendable()).map(c => c.toString()))
    : "Here";
  const name = rand(input.guild?.members.cache.map(m => m.toString()) ?? [("user" in input ? input.user : input.author).toString()]);
  const intro = set.intros.getRandom();
  let person = set.people.getRandom();
  let excuse = set.excuses.getRandom();
  const pronoun = person[0];
  let them = "";
  let their = "";
  switch (pronoun) {
    case "%": them = "him"; their = "his";
      break;
    case "^": them = "her"; their = "her";
      break;
    case "!": them = "it"; their = "its";
      break;
    default: them = "them"; their = "their";
      break;
  }
  person = person.substring(1);
  if (/[.!?]$/.test(intro) && excuse[0] === "#") person = person[0].toUpperCase() + person.substring(1);
  excuse = excuse
    .replace(/%/g, them)
    .replace(/\$/g, their)
    .replace(/#/g, person)
    .replace(/<@channel>/, channel)
    .replace(/<@name>/, name);

  input.reply(excuse);
}

Client.on("interactionCreate", (int) => {
  if (int.isChatInputCommand() && int.commandId === cmdSF.commands.slashLater) later(int);
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