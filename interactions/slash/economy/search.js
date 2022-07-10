/**
 * @file Search command.
 * @author Naman Vrati
 * @since 2.0.5
 * @version 2.0.5
 */

// Deconstructed the constants we need in this file.

const {
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	Message,
} = require('discord.js');
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

			amount = -user.balance * (searchConfig.wallet_lost / 100);
		}

		// Create Message & Get 3 random strings.

		/**
		 * @type {Array<string[]>}
		 */

		let shuffledArray = arrayShuffler(searchStrings).slice(0, 3);

		/**
		 * @type {MessageButton[]}
		 */
		let buttons = [];

		/**
		 * @type {MessageButton[]}
		 */
		let disabledButtons = [];

		for (const [index, value] of shuffledArray.entries()) {
			const button = new MessageButton()
				.setCustomId(`economy_search_${shuffledArray[index][0]}`)
				.setStyle('PRIMARY')
				.setLabel(shuffledArray[index][0]);

			buttons.push(button);

			disabledButtons.push(new MessageButton(button).setDisabled(true));
		}

		// Ask for a choice.

		await interaction.reply({
			content: `**Where do you want to search?**\n*Pick an option below to start searching that location!*`,
			components: [new MessageActionRow().addComponents(buttons)],
		});

		/**
		 * @type {Message}
		 */
		// @ts-ignore
		const msg = await interaction.fetchReply();

		// Create a button collector.

		const collector = msg.createMessageComponentCollector({
			componentType: 'BUTTON',
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
				await msg.edit({
					components: [
						new MessageActionRow().addComponents(disabledButtons),
					],
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								"You didn't selected any option, search mission was aborted!",
							),
					],
				});

				return;
			}

			selected = collected.last().customId;

			// Find the button which is selected & highlight it.

			const choosen = disabledButtons.find((b) => b.customId == selected);

			disabledButtons[disabledButtons.indexOf(choosen)] =
				choosen.setStyle('SUCCESS');

			await msg.edit({
				components: [
					new MessageActionRow().addComponents(disabledButtons),
				],
			});

			// Extract the button label directly

			selected = choosen.label;

			// Display the results.

			const embed = new MessageEmbed().setTitle(
				`${interaction.user.username} searched the ${selected}`,
			);

			if (amount > 0) {
				// Postive Results.

				embed
					.setColor('GREEN')
					.setDescription(
						shuffledArray
							.find((a) => a[0] == selected)[1]
							.replace(
								'{{amount}}',
								`${amount} ${currency.emoji}`,
							),
					)
					.setFooter({ text: 'May consider yourself lucky!' });
			} else {
				// Negative Results.

				embed
					.setColor('RED')
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
