const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`\n🔮 ${client.user.tag} est éveillée et prête à servir la guilde !`);
    console.log(`📡 Connectée sur ${client.guilds.cache.size} serveur(s)`);
    client.user.setPresence({
      activities: [{ name: '⚔️ La guilde | /aide', type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
