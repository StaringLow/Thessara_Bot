const {
  SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
  ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('🎫 Système de tickets de la guilde')
    .addSubcommand((sub) => sub.setName('panel').setDescription('📋 Créer le panel de tickets (Admin)')),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Réservé aux administrateurs.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('🎫 Système de Tickets — Thessara')
      .setDescription(
        '*Thessara dépose une plume et un parchemin devant toi...*\n\n' +
        '> Clique sur le bouton ci-dessous pour ouvrir un ticket.\n' +
        '> Un modérateur viendra t\'aider dès que possible.\n\n' +
        '📌 Ne crée pas de ticket inutilement.'
      )
      .setFooter({ text: 'Thessara • Assistance de la guilde' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Ouvrir un ticket')
        .setEmoji('🎫')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },

  async handleButton(interaction, client) {
    const guild = interaction.guild;
    const user = interaction.user;

    const existing = guild.channels.cache.find(
      (c) => c.name === `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    );
    if (existing) {
      return interaction.reply({ content: `❌ Tu as déjà un ticket ouvert : ${existing}`, ephemeral: true });
    }

    const permissionOverwrites = [
      { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
    ];

    if (client.config.roles.staff) {
      permissionOverwrites.push({
        id: client.config.roles.staff,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
      });
    }

    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      type: ChannelType.GuildText,
      permissionOverwrites,
    });

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('🎫 Ticket ouvert')
      .setDescription(
        `Bienvenue ${user}, **Thessara** a entendu ton appel.\n\n` +
        '📝 Décris ton problème ou ta demande, un modérateur arrivera bientôt.\n\n' +
        '> Clique sur **Fermer le ticket** quand ton problème est résolu.'
      )
      .setFooter({ text: 'Thessara • Assistance' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Fermer le ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ content: `${user}`, embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ton ticket a été créé : ${ticketChannel}`, ephemeral: true });
  },

  async closeTicket(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColorError)
      .setDescription('🔒 Ce ticket sera fermé dans **5 secondes**...')
      .setFooter({ text: 'Thessara • Assistance' });
    await interaction.reply({ embeds: [embed] });
    setTimeout(async () => {
      await interaction.channel.delete().catch(console.error);
    }, 5000);
  },
};
