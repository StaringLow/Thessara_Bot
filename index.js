const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();
client.config = config;

const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
const allCommands = [];

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands', folder))
    .filter((f) => f.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      allCommands.push(command.data.toJSON());
      console.log(`✅ Commande chargée : /${command.data.name}`);
    }
  }
}

const eventFiles = fs
  .readdirSync(path.join(__dirname, 'events'))
  .filter((f) => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`📡 Événement chargé : ${event.name}`);
}

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(config.token);
  try {
    console.log('🔄 Déploiement des commandes slash...');
    await rest.put(Routes.applicationCommands(config.clientId), { body: allCommands });
    console.log('✅ Commandes slash déployées !');
  } catch (error) {
    console.error('❌ Erreur déploiement commandes :', error);
  }
}

deployCommands().then(() => {
  client.login(config.token).then(() => {
    require('./dashboard/server')(client);
  }).catch((err) => {
    console.error('❌ Impossible de se connecter à Discord :', err.message);
  });
});
