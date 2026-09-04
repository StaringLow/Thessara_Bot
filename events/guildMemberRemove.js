const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const config = client.config;
    if (!config.channels.logs) return;
    const logChannel = member.guild.channels.cache.get(config.channels.logs);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(config.embedColorError)
      .setTitle('📤 Membre parti')
      .addFields(
        { name: 'Utilisateur', value: `${member.user.tag} (${member.id})`, inline: true },
        { name: 'Avait rejoint le', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Inconnu', inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  },
};
