const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aide')
    .setDescription('📜 Voir toutes les commandes de Thessara'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('📜 Parchemin des Commandes — Thessara')
      .setDescription('*Thessara déroule un long parchemin avec sagesse...*')
      .addFields(
        { name: '⚔️ Modération', value: '`/ban` `/kick` `/mute` `/unmute` `/clear`', inline: false },
        { name: '🎫 Tickets', value: '`/ticket panel` — Ouvrir le panel de support', inline: false },
        { name: '⚙️ Administration', value: '`/setup-bienvenue` `/setup-logs`', inline: false },
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: 'Thessara • Oracle de la guilde' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
