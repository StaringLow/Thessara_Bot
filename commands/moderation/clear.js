const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('🗑️ Supprimer des messages en masse')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((opt) => opt.setName('nombre').setDescription('Nombre de messages à supprimer (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),

  async execute(interaction, client) {
    const nombre = interaction.options.getInteger('nombre');
    try {
      await interaction.deferReply({ ephemeral: true });
      const deleted = await interaction.channel.bulkDelete(nombre, true);
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColorSuccess)
        .setDescription(`🗑️ **${deleted.size}** message(s) supprimé(s) par ${interaction.user}.`)
        .setFooter({ text: 'Thessara • Modération' })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply({ content: '❌ Erreur : les messages de plus de 14 jours ne peuvent pas être supprimés en masse.' });
    }
  },
};
