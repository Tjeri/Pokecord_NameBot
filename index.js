const db = require('./Pokemon.json')
require('dotenv').config();

const {Client, Intents, MessageEmbed} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});
const POKECORD_ID = 705016654341472327;

client.on('ready', () => {
  console.log(`READY ! The bot has started with ${client.users.cache.size} users in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
});

client.on('error', error => {
  console.log(`ERROR ${error}`);
});

client.on('guildCreate', guild => {
  console.log(`GUILD JOIN ${guild.name} (${guild.id})`);
});

client.on('guildDelete', guild => {
  console.log(`GUILD LEAVE ${guild.name} (${guild.id})`);
});

client.on('messageCreate', message => {    
    if (message.guild && !message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    
    if (message.guild && !message.channel.permissionsFor(client.user).has('EMBED_LINKS')) {
      return message.channel.send("I need the `Embed Links` permission. Please contact an administrator on this server.");
    }
	  	
    if (message.author.id == POKECORD_ID) {
		message.embeds.forEach((e) => {
			if (e.image && e.description) {
				let description = e.description;
				if(!description.endsWith('to catch it!')) return;
				let prefix = description.substring(description.indexOf("`") + 1, description.indexOf("<"));
				let embed = new MessageEmbed().setColor(0xFF4500);
				let url = e.image.url;
				let id = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
			
				let result = db[id];
				if (result === undefined) {
					console.log(`Pokemon ${id} not found in Pokemon.json for ${message.url}`);
					embed.setTitle("Pokemon Not Found").setDescription("Please contact admins to add this Pokemon to the database.");
					return message.channel.send({embeds: [embed]});
				}
				embed.setTitle(prefix + result);
				message.channel.send({embeds: [embed]});
			}
		});
	}
});

client.login(process.env.TOKEN);