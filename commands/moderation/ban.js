const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('⚔️ Bannir un membre de la guilde')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) => opt.setName('membre').setDescription('Le membre à bannir').setRequired(true))
    .addStringOption((opt) => opt.setName('raison').setDescription('Raison du bannissement').setRequired(false)),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: '❌ Je ne peux pas bannir ce membre.', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Tu ne peux pas te bannir toi-même.', ephemeral: true });

    try {
      await target.ban({ reason: raison });
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColorError)
        .setTitle('🔨 Membre banni')
        .setThumbnail(target.user.displayAvatarURL())
        .addFields(
          { name: 'Membre', value: `${target.user.tag}`, inline: true },
          { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
          { name: 'Raison', value: raison }
        )
        .setFooter({ text: 'Thessara • Modération' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      if (client.config.channels.logs) {
        const logChannel = interaction.guild.channels.cache.get(client.config.channels.logs);
        if (logChannel) logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      interaction.reply({ content: '❌ Erreur lors du bannissement.', ephemeral: true });
    }
  },
};
