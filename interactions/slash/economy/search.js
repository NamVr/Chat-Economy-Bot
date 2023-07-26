/**
 * @file Search command.
 * @author Naman Vrati
 * @since 2.0.5
 * @version 3.0.0
 */

// Deconstructed the constants we need in this file.

const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const random = require('../../../functions/get/random-number');
const manager = require('../../../functions/database');
const arrayShuffler = require('../../../functions/get/array-shuffler');
const searchStrings = require('../../../messages/strings/search.json');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription(
			'Search for some money! (small chance of loosing too!)',
		),
	cooldown: 30 * 60,

	async execute(interaction) {
		// Get the currency settings from the database.

		const config = manager.getConfigFile();
		const currency = config.settings.currency;
		const searchConfig = config.commands.search;

		// Get the user from the database.

		const userDB = manager.getUserDB();

		const user = userDB.find((f) => f.user_id == interaction.user.id);

		// Create a probability of win/loss by 90/10%.

		let amount = 0;

		if (random(0, 9)) {
			// Positive!

			amount = random(searchConfig.min, searchConfig.max);
		} else {
			// Negative :(

			amount = -(user.balance * (searchConfig.wallet_lost / 100)) | 0;
		}

		// Create Message & Get 3 random strings.

		/**
		 * @type {Array<string[]>}
		 */

		let shuffledArray = arrayShuffler(searchStrings).slice(0, 3);

		/**
		 * @type {Discord.ButtonBuilder[]}
		 */
		let buttons = [];

		/**
		 * @type {Discord.ButtonBuilder[]}
		 */
		let disabledButtons = [];

		for (const [index, value] of shuffledArray.entries()) {
			const button = new Discord.ButtonBuilder()
				.setCustomId(`economy_search_${shuffledArray[index][0]}`)
				.setStyle(Discord.ButtonStyle.Primary)
				.setLabel(shuffledArray[index][0]);

			buttons.push(button);

			disabledButtons.push(
				new Discord.ButtonBuilder(button.data).setDisabled(true),
			);
		}

		// Ask for a choice.

		/**
		 * @type {Discord.ActionRowBuilder<Discord.ButtonBuilder>}
		 */
		const actionRow = new Discord.ActionRowBuilder();

		await interaction.reply({
			content: `**Where do you want to search?**\n*Pick an option below to start searching that location!*`,
			components: [actionRow.addComponents(buttons)],
		});

		/**
		 * @type {Discord.Message}
		 */
		// @ts-ignore
		const msg = await interaction.fetchReply();

		// Create a button collector.

		const collector = msg.createMessageComponentCollector({
			componentType: Discord.ComponentType.Button,
			time: 10000,
		});

		collector.on('collect', (i) => {
			i.deferUpdate();
			if (i.user.id === interaction.user.id) {
				collector.stop();
			}
		});

		// When collector is ended.

		let selected = '';

		collector.on('end', async (collected) => {
			// If no choice was selected, return.

			if (!collected.last()) {
				/**
				 * @type {Discord.ActionRowBuilder<Discord.ButtonBuilder>}
				 */
				const actionRow = new Discord.ActionRowBuilder();

				await msg.edit({
					components: [actionRow.addComponents(disabledButtons)],
					embeds: [
						new Discord.EmbedBuilder()
							.setColor('Red')
							.setDescription(
								"You didn't selected any option, search mission was aborted!",
							),
					],
				});

				return;
			}

			selected = collected.last().customId;

			// Find the button which is selected & highlight it.

			const choosen = disabledButtons.find(
				// @ts-ignore
				(b) => b.data.custom_id == selected,
			);

			disabledButtons[disabledButtons.indexOf(choosen)] =
				choosen.setStyle(Discord.ButtonStyle.Success);

			/**
			 * @type {Discord.ActionRowBuilder<Discord.ButtonBuilder>}
			 */
			const actionRow = new Discord.ActionRowBuilder();

			await msg.edit({
				components: [actionRow.addComponents(disabledButtons)],
			});

			// Extract the button label directly

			selected = choosen.data.label;

			// Display the results.

			const embed = new Discord.EmbedBuilder().setTitle(
				`${interaction.user.username} searched the ${selected}`,
			);

			if (amount > 0) {
				// Postive Results.

				embed
					.setColor('Green')
					.setDescription(
						shuffledArray
							.find((a) => a[0] == selected)[1]
							.replace(
								'{{amount}}',
								`**${amount} ${currency.emoji}**`,
							),
					)
					.setFooter({ text: 'May consider yourself lucky!' });
			} else {
				// Negative Results.

				embed
					.setColor('Red')
					.setDescription(
						`*The luck is not with you everytime!*\n\nYou have lost **${
							searchConfig.wallet_lost
						}% of your wallet**, i.e. **${-amount} ${
							currency.name
						}** ${currency.emoji}!`,
					)
					.setFooter({ text: 'You suck!' });
			}

			// Finally reply & edit the interaction.

			await interaction.editReply({
				embeds: [embed],
				content: '​',
			});
		});

		// Update the user in the user database.

		user.balance += amount;

		userDB.indexOf(user) != -1
			? (userDB[userDB.indexOf(user)] = user)
			: userDB.push(user);
		manager.putUserDB(userDB);

		// The job is done!

		return;
	},
};
