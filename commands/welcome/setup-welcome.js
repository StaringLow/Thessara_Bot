const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-bienvenue')
    .setDescription('⚙️ Configurer le salon de bienvenue')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((opt) => opt.setName('salon').setDescription('Salon où envoyer les messages de bienvenue').setRequired(true)),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('salon');
    const configPath = path.join(__dirname, '../../config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.channels.welcome = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    client.config.channels.welcome = channel.id;

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColorSuccess)
      .setTitle('✅ Salon de bienvenue configuré')
      .setDescription(`Les nouveaux membres seront accueillis dans ${channel}.`)
      .setFooter({ text: 'Thessara • Configuration' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
