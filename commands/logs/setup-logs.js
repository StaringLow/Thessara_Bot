const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-logs')
    .setDescription('⚙️ Configurer le salon des logs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((opt) => opt.setName('salon').setDescription('Salon où envoyer les logs').setRequired(true)),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('salon');
    const configPath = path.join(__dirname, '../../config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.channels.logs = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    client.config.channels.logs = channel.id;

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColorSuccess)
      .setTitle('✅ Salon de logs configuré')
      .setDescription(`Tous les logs seront envoyés dans ${channel}.`)
      .setFooter({ text: 'Thessara • Configuration' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
