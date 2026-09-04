const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Erreur commande /${interaction.commandName}:`, error);
        const errEmbed = new EmbedBuilder()
          .setColor(client.config.embedColorError)
          .setTitle('⚠️ Une erreur est survenue')
          .setDescription('Thessara a rencontré un problème en exécutant cette commande.')
          .setFooter({ text: 'Thessara • Oracle de la guilde' })
          .setTimestamp();
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        const ticketCommand = client.commands.get('ticket');
        if (ticketCommand && ticketCommand.handleButton) await ticketCommand.handleButton(interaction, client);
      }
      if (interaction.customId === 'close_ticket') {
        const ticketCommand = client.commands.get('ticket');
        if (ticketCommand && ticketCommand.closeTicket) await ticketCommand.closeTicket(interaction, client);
      }
    }
  },
};
