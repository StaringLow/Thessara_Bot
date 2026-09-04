const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Expulser un membre de la guilde')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((opt) => opt.setName('membre').setDescription('Le membre à expulser').setRequired(true))
    .addStringOption((opt) => opt.setName('raison').setDescription('Raison de l\'expulsion').setRequired(false)),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: '❌ Je ne peux pas expulser ce membre.', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Tu ne peux pas t\'expulser toi-même.', ephemeral: true });

    try {
      await target.kick(raison);
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColorWarn)
        .setTitle('👢 Membre expulsé')
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
      interaction.reply({ content: '❌ Erreur lors de l\'expulsion.', ephemeral: true });
    }
  },
};
