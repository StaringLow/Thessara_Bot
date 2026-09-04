const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const config = client.config;

    if (config.roles.member) {
      const role = member.guild.roles.cache.get(config.roles.member);
      if (role) await member.roles.add(role).catch(console.error);
    }

    if (!config.channels.welcome) return;
    const channel = member.guild.channels.cache.get(config.channels.welcome);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('✨ Un nouveau voyageur rejoint la guilde !')
      .setDescription(
        `Bienvenue parmi nous, ${member}!\n\n` +
        `*Thessara lève les yeux de ses parchemins et t'accueille d'un sourire sage...*\n\n` +
        `📜 Lis bien les règles et présente-toi !\n` +
        `⚔️ Tu es maintenant le **${member.guild.memberCount}ème** membre de la guilde.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ text: 'Thessara • Oracle de la guilde' })
      .setTimestamp();

    channel.send({ content: `${member}`, embeds: [embed] }).catch(console.error);

    if (config.channels.logs) {
      const logChannel = member.guild.channels.cache.get(config.channels.logs);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(config.embedColorSuccess)
          .setTitle('📥 Nouveau membre')
          .addFields(
            { name: 'Utilisateur', value: `${member.user.tag} (${member.id})`, inline: true },
            { name: 'Compte créé le', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] }).catch(console.error);
      }
    }
  },
};
