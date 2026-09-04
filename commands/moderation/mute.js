const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🔇 Réduire au silence un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('membre').setDescription('Le membre à rendre silencieux').setRequired(true))
    .addIntegerOption((opt) => opt.setName('duree').setDescription('Durée en minutes (max 40320)').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption((opt) => opt.setName('raison').setDescription('Raison du silence').setRequired(false)),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    const duree = interaction.options.getInteger('duree');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Tu ne peux pas te rendre silencieux toi-même.', ephemeral: true });

    try {
      await target.timeout(duree * 60 * 1000, raison);
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColorWarn)
        .setTitle('🔇 Membre réduit au silence')
        .setThumbnail(target.user.displayAvatarURL())
        .addFields(
          { name: 'Membre', value: `${target.user.tag}`, inline: true },
          { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
          { name: 'Durée', value: `${duree} minute(s)`, inline: true },
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
      interaction.reply({ content: '❌ Erreur lors du silence.', ephemeral: true });
    }
  },
};
