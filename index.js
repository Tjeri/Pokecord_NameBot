const db = require('./Pokemons.json')
const request = require('request').defaults({ encoding: null });

const Discord = require('discord.js');
const client = new Discord.Client();

const express = require('express');
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);


client.on('ready', () => {
  console.log(`READY Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`, "Ready", "event");
});

client.on('error', error => {
  console.log(`ERROR ${error}`);
  client.log(error, "Error", "error");
});

client.on('guildCreate', guild => {
  console.log(`GUILD JOIN ${guild.name} (${guild.id})`);
  client.log(`${guild.name} (${guild.id})`, "Guild Join", "joinleave");
});

client.on('guildDelete', guild => {
  console.log(`GUILD LEAVE ${guild.name} (${guild.id})`);
  client.log(`${guild.name} (${guild.id})`, "Guild Leave", "joinleave");
});

client.on('message', message => {
  try {
  	let embed = new Discord.RichEmbed().setColor(0xFF4500);
    
    if (message.guild && !message.channel.memberPermissions(client.user).has('SEND_MESSAGES')) return;
    
    if (message.guild && !message.channel.memberPermissions(client.user).has('EMBED_LINKS')) {
      return message.channel.send("I need the `Embed Links` permission. Please contact an administrator on this server.");
    }

    if (message.author.id == process.env.POKECORD_ID) {
		message.embeds.forEach((e) => {
			if (e.image) {
				let url = e.image.url;
				let id = parseInt(url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')));
			
				let result = db[id];
				if (result === undefined) {
					embed.setTitle("Pokemon Not Found").setDescription("Please contact admins to add this Pokemon to the database.");
					return message.channel.send(embed);
				}
				embed.setTitle("Possible Pokemon: " + result);
				message.channel.send(embed);
			}
		});
	}
});

client.clean = async (text) => {
  if (text && text.constructor.name == "Promise")
    text = await text;
  
  if (typeof evaled !== "string")
    text = require("util").inspect(text, {depth: 1});

  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replace(process.env.TOKEN, "--NO--TOKEN--");

  return text;
};

client.log = async (content, title, type) => {
  let embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(content.toString().substr(0, 2048))
    .setColor(0xFF4500)
    .setTimestamp();
  
  if (type === "event") {
    client.channels.get(process.env.EVENTCHANNEL).send(embed);
  }
  else if (type === "error") {
    client.channels.get(process.env.ERRORCHANNEL).send(embed);
  }
  else if (type === "joinleave") {
    client.channels.get(process.env.JOINLEAVECHANNEL).send(embed);
  }
};

client.login(process.env.TOKEN);