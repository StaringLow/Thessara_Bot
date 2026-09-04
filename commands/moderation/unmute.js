const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔊 Redonner la parole à un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('membre').setDescription('Le membre à libérer du silence').setRequired(true)),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    try {
      await target.timeout(null);
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColorSuccess)
        .setTitle('🔊 Silence levé')
        .addFields(
          { name: 'Membre', value: `${target.user.tag}`, inline: true },
          { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
        )
        .setFooter({ text: 'Thessara • Modération' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: '❌ Erreur lors du unmute.', ephemeral: true });
    }
  },
};
