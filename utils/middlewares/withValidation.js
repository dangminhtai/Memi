const validateCommandUsage = require('./validateCommandUsage');

function withValidation(dirname, commandModule) {
  if (typeof commandModule.execute !== 'function') return commandModule;

  const originalExecute = commandModule.execute;

  commandModule.execute = async function(interaction, ...args) {
    const error = validateCommandUsage(interaction, dirname);
    if (error) {
      return interaction.reply({ content: error, ephemeral: true });
    }

    return originalExecute(interaction, ...args);
  };

  return commandModule;
}

module.exports = { withValidation };
